import axios from 'axios';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  getCurrentUser,
  login as loginRequest,
  register as registerRequest,
} from '../api/auth';
import type { LoginRequest, RegisterRequest, User } from '../types/auth';
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from '../utils/authToken';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionError: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (details: RegisterRequest) => Promise<User>;
  logout: () => void;
  retrySession: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const sessionRequestId = useRef(0);

  const restoreSession = useCallback(async () => {
    const requestId = ++sessionRequestId.current;
    const accessToken = getAccessToken();

    if (!accessToken) {
      setUser(null);
      setSessionError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setSessionError(null);

    try {
      const currentUser = await getCurrentUser();
      if (sessionRequestId.current === requestId) {
        setUser(currentUser);
      }
    } catch (error) {
      if (sessionRequestId.current !== requestId) return;

      setUser(null);

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        clearAccessToken();
      } else {
        setSessionError(
          'We could not verify your session. Check your connection and try again.',
        );
      }
    } finally {
      if (sessionRequestId.current === requestId) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  const login = useCallback(async (credentials: LoginRequest) => {
    sessionRequestId.current += 1;
    const tokenResponse = await loginRequest(credentials);
    setAccessToken(tokenResponse.access_token);

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setSessionError(null);
    } catch (error) {
      clearAccessToken();
      setUser(null);
      throw error;
    }
  }, []);

  const register = useCallback((details: RegisterRequest) => {
    return registerRequest(details);
  }, []);

  const logout = useCallback(() => {
    sessionRequestId.current += 1;
    clearAccessToken();
    setUser(null);
    setSessionError(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      sessionError,
      login,
      register,
      logout,
      retrySession: restoreSession,
    }),
    [user, isLoading, sessionError, login, register, logout, restoreSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}
