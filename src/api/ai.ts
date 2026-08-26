import apiClient from './client';
import type {
  AIGameAnalysisRequest,
  AIGameAnalysisResponse,
} from '../types/ai';

export async function generateGameAnalysis(
  payload: AIGameAnalysisRequest,
): Promise<AIGameAnalysisResponse> {
  const response = await apiClient.post<AIGameAnalysisResponse>(
    '/ai/game-analysis',
    payload,
  );
  return response.data;
}
