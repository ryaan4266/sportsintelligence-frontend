const ACCESS_TOKEN_KEY = 'athena_access_token';

export function getAccessToken(): string | null {
  try {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAccessToken(accessToken: string): void {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

export function clearAccessToken(): void {
  try {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {
    // The browser has already made the stored token inaccessible.
  }
}
