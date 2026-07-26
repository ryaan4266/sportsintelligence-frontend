import { useEffect, useMemo, useRef, useState } from 'react';
import type {
  LiveConnectionStatus,
  LiveGameState,
  LivePlayerStatChange,
  MomentumPoint,
  UseLiveGameOptions,
} from '../types/liveGame';
import { buildLiveGameWebSocketUrl, parseLiveGameUpdate } from '../utils/liveGame';

const DEFAULT_API_BASE_URL = 'http://localhost:8000';
const MAXIMUM_MOMENTUM_POINTS = 30;

const initialState: LiveGameState = {
  connectionStatus: 'connecting',
  latestUpdate: null,
  momentumHistory: [],
  playerStats: [],
  latestPlayerIds: [],
  error: null,
  retryCount: 0,
  messageCount: 0,
};

export function useLiveGame(
  gameId: number,
  options: UseLiveGameOptions = {},
): LiveGameState {
  const {
    enabled = true,
    baseUrl = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
    initialRetryDelayMs = 1000,
    maximumRetryDelayMs = 30000,
    maximumRetries = 8,
  } = options;
  const [state, setState] = useState<LiveGameState>(() => ({
    ...initialState,
    connectionStatus: enabled ? 'connecting' : 'disconnected',
  }));
  const socketRef = useRef<WebSocket | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Refs hold connection bookkeeping without retriggering the socket effect.
  const retryCountRef = useRef(0);
  const sequenceRef = useRef(0);
  const playerStatsRef = useRef(new Map<number, LivePlayerStatChange>());
  const webSocketUrl = useMemo(
    () => buildLiveGameWebSocketUrl(baseUrl, gameId),
    [baseUrl, gameId],
  );

  useEffect(() => {
    let isDisposed = false;

    function clearRetryTimer() {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    }

    function updateConnectionStatus(
      connectionStatus: LiveConnectionStatus,
      error: string | null = null,
    ) {
      setState((currentState) => ({
        ...currentState,
        connectionStatus,
        error,
        retryCount: retryCountRef.current,
      }));
    }

    function scheduleReconnect() {
      if (isDisposed || retryTimerRef.current) {
        return;
      }

      if (retryCountRef.current >= maximumRetries) {
        updateConnectionStatus(
          'disconnected',
          'Live updates are unavailable after several connection attempts.',
        );
        return;
      }

      const delay = Math.min(
        initialRetryDelayMs * 2 ** retryCountRef.current,
        maximumRetryDelayMs,
      );
      retryCountRef.current += 1;
      updateConnectionStatus('reconnecting');
      retryTimerRef.current = setTimeout(() => {
        retryTimerRef.current = null;
        connect();
      }, delay);
    }

    function connect() {
      if (
        isDisposed ||
        socketRef.current?.readyState === WebSocket.OPEN ||
        socketRef.current?.readyState === WebSocket.CONNECTING
      ) {
        return;
      }

      updateConnectionStatus(
        retryCountRef.current > 0 ? 'reconnecting' : 'connecting',
      );
      const socket = new WebSocket(webSocketUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        if (isDisposed || socketRef.current !== socket) {
          return;
        }

        updateConnectionStatus('connected');
      };

      socket.onmessage = (event: MessageEvent<string>) => {
        if (isDisposed || socketRef.current !== socket) {
          return;
        }

        const update = parseLiveGameUpdate(event.data);
        if (!update || update.game_id !== gameId) {
          setState((currentState) => ({
            ...currentState,
            error: 'A malformed live update was ignored.',
          }));
          return;
        }

        // An open socket can still be rejected immediately (for example, with 1013
        // when the server is at capacity). A valid update is the health signal that
        // ends the current retry sequence and resets exponential backoff.
        retryCountRef.current = 0;
        update.player_stat_changes.forEach((playerStat) => {
          // Payloads contain deltas for changed players only; totals replace their prior row.
          playerStatsRef.current.set(playerStat.player_id, playerStat);
        });
        sequenceRef.current += 1;
        const momentumPoint: MomentumPoint = {
          sequence: sequenceRef.current,
          label: `Q${update.quarter} ${update.time_remaining}`,
          value: update.momentum_value,
        };

        setState((currentState) => ({
          ...currentState,
          connectionStatus: 'connected',
          latestUpdate: update,
          // Bound the chart data so long-running games do not grow client memory indefinitely.
          momentumHistory: [...currentState.momentumHistory, momentumPoint].slice(
            -MAXIMUM_MOMENTUM_POINTS,
          ),
          playerStats: Array.from(playerStatsRef.current.values()),
          latestPlayerIds: update.player_stat_changes.map(
            (playerStat) => playerStat.player_id,
          ),
          error: null,
          retryCount: 0,
          messageCount: currentState.messageCount + 1,
        }));
      };

      socket.onerror = () => {
        if (!isDisposed && socketRef.current === socket) {
          updateConnectionStatus('error', 'The live connection encountered an error.');
        }
      };

      socket.onclose = (event) => {
        if (socketRef.current === socket) {
          socketRef.current = null;
        }
        if (isDisposed) {
          return;
        }

        if (event.code === 1008) {
          updateConnectionStatus(
            'error',
            'This game is unavailable or the live stream rejected the request.',
          );
          return;
        }

        scheduleReconnect();
      };
    }

    clearRetryTimer();
    socketRef.current?.close(1000, 'Replacing live game connection');
    socketRef.current = null;
    retryCountRef.current = 0;
    sequenceRef.current = 0;
    playerStatsRef.current.clear();
    setState({
      ...initialState,
      connectionStatus: enabled ? 'connecting' : 'disconnected',
    });

    if (enabled) {
      connect();
    }

    return () => {
      isDisposed = true;
      clearRetryTimer();
      const socket = socketRef.current;
      socketRef.current = null;
      if (socket) {
        socket.onopen = null;
        socket.onmessage = null;
        socket.onerror = null;
        socket.onclose = null;
        socket.close(1000, 'Live dashboard closed');
      }
    };
  }, [
    enabled,
    gameId,
    initialRetryDelayMs,
    maximumRetries,
    maximumRetryDelayMs,
    webSocketUrl,
  ]);

  return state;
}
