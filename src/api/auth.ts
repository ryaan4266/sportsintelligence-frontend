import apiClient from './client';
import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  User,
} from '../types/auth';

export async function register(request: RegisterRequest): Promise<User> {
  const response = await apiClient.post<User>('/auth/register', request);
  return response.data;
}

export async function login(request: LoginRequest): Promise<TokenResponse> {
  const response = await apiClient.post<TokenResponse>('/auth/login', request);
  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<User>('/auth/me');
  return response.data;
}
