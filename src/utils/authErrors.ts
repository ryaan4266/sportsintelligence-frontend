import axios from 'axios';

export function getLoginErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      return 'The email or password you entered is incorrect.';
    }

    if (error.response?.status === 422) {
      return 'Enter a valid email address and password.';
    }

    if (!error.response) {
      return 'Unable to reach Athena. Check your connection and try again.';
    }
  }

  return 'Unable to sign in right now. Please try again.';
}

export function getRegistrationErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 409) {
      return 'An account with this email address already exists.';
    }

    if (error.response?.status === 422) {
      return 'Check your email and password, then try again.';
    }

    if (!error.response) {
      return 'Unable to reach Athena. Check your connection and try again.';
    }
  }

  return 'Unable to create your account right now. Please try again.';
}
