import axios from 'axios';

const DEFAULT_API_BASE_URL = 'http://localhost:8000';

const apiBaseUrl = normalizeApiBaseUrl(
  import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
);

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Interceptors can be added here as the API surface evolves.

export default apiClient;

function normalizeApiBaseUrl(baseUrl: string): string {
  const trimmedBaseUrl = baseUrl.trim().replace(/\/+$/, '');

  try {
    const url = new URL(trimmedBaseUrl);
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return url.toString().replace(/\/+$/, '');
    }
  } catch {
    return DEFAULT_API_BASE_URL;
  }

  return DEFAULT_API_BASE_URL;
}
