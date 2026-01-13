// src/hooks/useApi.ts
import { useState, useCallback, useRef,useEffect } from 'react';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  immediate?: boolean;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: any;
  status: 'idle' | 'loading' | 'success' | 'error';
}

type ApiFunction<T, P extends any[]> = (...args: P) => Promise<T>;

export const useApi = <T, P extends any[] = []>(
  apiFunction: ApiFunction<T, P>,
  options: UseApiOptions<T> = {}
) => {
  const { onSuccess, onError  = false } = options;
  // immediate
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    status: 'idle',
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Cancel any ongoing request
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Reset state
  const reset = useCallback(() => {
    cancelRequest();
    setState({
      data: null,
      loading: false,
      error: null,
      status: 'idle',
    });
  }, [cancelRequest]);

  // Execute the API call
  const execute = useCallback(
    async (...args: P): Promise<T> => {
      // Cancel any ongoing request
      cancelRequest();

      // Create new AbortController
      abortControllerRef.current = new AbortController();

      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
        status: 'loading',
      }));

      try {
        // Pass abort signal to API function if it accepts it
        const signal = abortControllerRef.current.signal;
        
        // Check if API function accepts signal as last parameter
        const apiArgs = [...args] as P;
        const lastArg = apiArgs[apiArgs.length - 1];
        
        // If last argument is an AbortSignal or similar, replace it
        // Otherwise, add signal as last parameter
        if (typeof lastArg === 'object' && 'aborted' in lastArg) {
          apiArgs[apiArgs.length - 1] = signal as any;
        } else {
          // Add signal as extra parameter (function must support it)
          apiArgs.push(signal as any);
        }

        const data = await apiFunction(...apiArgs);
        
        // Check if request was cancelled
        if (abortControllerRef.current?.signal.aborted) {
          throw new Error('Request was cancelled');
        }

        setState({
          data,
          loading: false,
          error: null,
          status: 'success',
        });

        if (onSuccess) {
          onSuccess(data);
        }

        abortControllerRef.current = null;
        return data;
      } catch (error: any) {
        // Don't update state if request was cancelled
        if (error.name === 'AbortError' || error.message === 'Request was cancelled') {
          abortControllerRef.current = null;
          throw error;
        }

        setState(prev => ({
          ...prev,
          loading: false,
          error,
          status: 'error',
        }));

        if (onError) {
          onError(error);
        }

        abortControllerRef.current = null;
        throw error;
      }
    },
    [apiFunction, onSuccess, onError, cancelRequest]
  );

  // Execute immediately if needed
  // const executeImmediate = useCallback(
  //   async (...args: P) => {
  //     return execute(...args);
  //   },
  //   [execute]
  // );

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    cancelRequest();
  }, [cancelRequest]);

  return {
    ...state,
    execute,
    reset,
    cancel: cancelRequest,
    cleanup,
    isIdle: state.status === 'idle',
    isLoading: state.loading,
    isSuccess: state.status === 'success',
    isError: state.error !== null,
  };
};

// Hook for single resource (GET by ID)
export const useApiResource = <T>(
  fetchFunction: (id: number, signal?: AbortSignal) => Promise<T>,
  id?: number
) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    status: 'idle',
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchResource = useCallback(async (resourceId?: number) => {
    const resourceIdToFetch = resourceId ?? id;
    if (resourceIdToFetch === undefined) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setState({
      data: null,
      loading: true,
      error: null,
      status: 'loading',
    });

    try {
      const data = await fetchFunction(resourceIdToFetch, signal);
      
      if (!signal.aborted) {
        setState({
          data,
          loading: false,
          error: null,
          status: 'success',
        });
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        setState({
          data: null,
          loading: false,
          error,
          status: 'error',
        });
      }
    } finally {
      if (!signal.aborted) {
        abortControllerRef.current = null;
      }
    }
  }, [fetchFunction, id]);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setState({
      data: null,
      loading: false,
      error: null,
      status: 'idle',
    });
  }, []);

  return {
    ...state,
    fetch: fetchResource,
    reset,
    refetch: () => fetchResource(id),
  };
};

// Hook for paginated data
export const usePaginatedApi = <T>(
  fetchFunction: (params: any, signal?: AbortSignal) => Promise<T[]>,
  initialParams = {}
) => {
  const [state, setState] = useState<{
    data: T[];
    loading: boolean;
    error: any;
    page: number;
    hasMore: boolean;
    params: any;
  }>({
    data: [],
    loading: false,
    error: null,
    page: 1,
    hasMore: true,
    params: initialParams,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchPage = useCallback(async (page = 1, params = {}) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const fetchParams = {
        ...state.params,
        ...params,
        page,
        limit: 10, // Default limit
      };

      const data = await fetchFunction(fetchParams, signal);
      
      if (!signal.aborted) {
        setState(prev => ({
          ...prev,
          data: page === 1 ? data : [...prev.data, ...data],
          loading: false,
          page,
          hasMore: data.length === fetchParams.limit,
          params: { ...prev.params, ...params },
        }));
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        setState(prev => ({
          ...prev,
          loading: false,
          error,
        }));
      }
    } finally {
      if (!signal.aborted) {
        abortControllerRef.current = null;
      }
    }
  }, [fetchFunction, state.params]);

  const loadMore = useCallback(() => {
    if (!state.loading && state.hasMore) {
      fetchPage(state.page + 1);
    }
  }, [fetchPage, state.loading, state.hasMore, state.page]);

  const refresh = useCallback(() => {
    fetchPage(1);
  }, [fetchPage]);

  const updateParams = useCallback((newParams: any) => {
    fetchPage(1, newParams);
  }, [fetchPage]);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setState({
      data: [],
      loading: false,
      error: null,
      page: 1,
      hasMore: true,
      params: initialParams,
    });
  }, [initialParams]);

  return {
    ...state,
    fetchPage,
    loadMore,
    refresh,
    updateParams,
    reset,
    isEmpty: state.data.length === 0 && !state.loading,
  };
};

// Hook for infinite scroll
export const useInfiniteScrollApi = <T>(
  fetchFunction: (params: any, signal?: AbortSignal) => Promise<T[]>,
  initialParams = {}
) => {
  const {
    data,
    loading,
    error,
    page,
    hasMore,
    params,
    fetchPage,
    loadMore,
    refresh,
    updateParams,
    reset,
  } = usePaginatedApi(fetchFunction, initialParams);

  return {
    data,
    loading,
    error,
    page,
    hasMore,
    params,
    fetchPage,
    loadMore,
    refresh,
    updateParams,
    reset,
    // Additional infinite scroll helpers
    canLoadMore: !loading && hasMore,
    isFirstLoad: page === 1 && loading,
    isRefreshing: page === 1 && loading && data.length > 0,
  };
};

// Hook for form submissions
export const useFormApi = <T, P extends any[] = []>(
  submitFunction: ApiFunction<T, P>
) => {
  const {
    data,
    loading,
    error,
    status,
    execute,
    reset,
    cancel,
  } = useApi(submitFunction);

  return {
    data,
    loading,
    error,
    status,
    submit: execute,
    reset,
    cancel,
    isSubmitting: loading,
    submitSuccess: status === 'success',
    submitError: error,
  };
};

// Hook for mutation operations (POST, PUT, DELETE)
export const useMutationApi = <T, P extends any[] = []>(
  mutationFunction: ApiFunction<T, P>
) => {
  const {
    data,
    loading,
    error,
    status,
    execute,
    reset,
  } = useApi(mutationFunction);

  const mutate = useCallback(async (...args: P) => {
    return execute(...args);
  }, [execute]);

  const mutateAsync = useCallback(async (...args: P) => {
    return execute(...args);
  }, [execute]);

  return {
    data,
    loading,
    error,
    status,
    mutate,
    mutateAsync,
    reset,
    isMutating: loading,
    isSuccess: status === 'success',
    isError: status === 'error',
  };
};

// Hook for query operations (GET)
export const useQueryApi = <T>(
  queryFunction: (params?: any, signal?: AbortSignal) => Promise<T>,
  params?: any,
  options?: UseApiOptions<T>
) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
    status: 'idle',
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (fetchParams?: any) => {
    const queryParams = fetchParams ?? params;
    
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setState({
      data: null,
      loading: true,
      error: null,
      status: 'loading',
    });

    try {
      const data = await queryFunction(queryParams, signal);
      
      if (!signal.aborted) {
        setState({
          data,
          loading: false,
          error: null,
          status: 'success',
        });

        if (options?.onSuccess) {
          options.onSuccess(data);
        }
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        setState({
          data: null,
          loading: false,
          error,
          status: 'error',
        });

        if (options?.onError) {
          options.onError(error);
        }
      }
    } finally {
      if (!signal.aborted) {
        abortControllerRef.current = null;
      }
    }
  }, [queryFunction, params, options]);

  const refetch = useCallback(() => {
    fetchData(params);
  }, [fetchData, params]);

  const resetState = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setState({
      data: null,
      loading: false,
      error: null,
      status: 'idle',
    });
  }, []);

  // Initial fetch
  useEffect(() => {
    if (params !== undefined) {
      fetchData();
    }
  }, [fetchData]);

  return {
    ...state,
    fetch: fetchData,
    refetch,
    reset: resetState,
    isLoading: state.loading,
    isSuccess: state.status === 'success',
    isError: state.error !== null,
  };
};

// Custom hook to combine multiple API calls
export const useCombineApis = <T extends Record<string, any>>(
  apiConfigs: {
    [K in keyof T]: {
      api: () => Promise<T[K]>;
      options?: UseApiOptions<T[K]>;
    }
  }
) => {
  const apiKeys = Object.keys(apiConfigs) as Array<keyof T>;
  
  const [state, setState] = useState<{
    data: { [K in keyof T]?: T[K] };
    loading: boolean;
    error: { [K in keyof T]?: any };
    status: { [K in keyof T]: 'idle' | 'loading' | 'success' | 'error' };
  }>({
    data: {},
    loading: false,
    error: {},
    status: apiKeys.reduce((acc, key) => ({ ...acc, [key]: 'idle' }), {} as any),
  });

  const abortControllersRef = useRef<Map<keyof T, AbortController>>(new Map());

  const fetchAll = useCallback(async () => {
    // Cancel all ongoing requests
    abortControllersRef.current.forEach(controller => controller.abort());
    abortControllersRef.current.clear();

    // Set loading state
    setState(prev => ({
      ...prev,
      loading: true,
      status: apiKeys.reduce((acc, key) => ({ ...acc, [key]: 'loading' }), {} as any),
    }));

    const newAbortControllers = new Map<keyof T, AbortController>();
    const promises = apiKeys.map(async (key) => {
      const controller = new AbortController();
      newAbortControllers.set(key, controller);

      try {
        const data = await apiConfigs[key].api();
        
        if (!controller.signal.aborted) {
          setState(prev => ({
            ...prev,
            data: { ...prev.data, [key]: data },
            status: { ...prev.status, [key]: 'success' },
          }));

          if (apiConfigs[key].options?.onSuccess) {
            apiConfigs[key].options.onSuccess!(data);
          }
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          setState(prev => ({
            ...prev,
            error: { ...prev.error, [key]: error },
            status: { ...prev.status, [key]: 'error' },
          }));

          if (apiConfigs[key].options?.onError) {
            apiConfigs[key].options.onError!(error);
          }
        }
      }
    });

    abortControllersRef.current = newAbortControllers;

    try {
      await Promise.allSettled(promises);
    } finally {
      setState(prev => ({
        ...prev,
        loading: false,
      }));
    }
  }, [apiConfigs, apiKeys]);

  const reset = useCallback(() => {
    abortControllersRef.current.forEach(controller => controller.abort());
    abortControllersRef.current.clear();
    
    setState({
      data: {},
      loading: false,
      error: {},
      status: apiKeys.reduce((acc, key) => ({ ...acc, [key]: 'idle' }), {} as any),
    });
  }, [apiKeys]);

  return {
    ...state,
    fetchAll,
    reset,
    isLoading: state.loading,
    hasErrors: Object.values(state.error).some(error => error !== null),
    allSuccess: Object.values(state.status).every(status => status === 'success'),
  };
};

export default useApi;