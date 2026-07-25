import { useEffect, useState, type DependencyList } from 'react';
import axios from 'axios';

interface ApiResourceState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

export function useApiResource<T>(
  request: () => Promise<T>,
  dependencies: DependencyList = [],
): ApiResourceState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadResource() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await request();
        if (isMounted) {
          setData(response);
        }
      } catch (caughtError) {
        if (isMounted) {
          setError(getRequestErrorMessage(caughtError));
          setData(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadResource();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, error, isLoading };
}

function getRequestErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 404) {
      return 'The requested record could not be found.';
    }

    if (error.response?.status) {
      return 'The backend returned an error while loading this data.';
    }

    return 'The backend could not be reached. Confirm the API server is running.';
  }

  return 'Something went wrong while loading this data.';
}
