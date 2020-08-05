import { useCallback, useRef, useEffect } from 'react';

const useEventCallback = <T extends (...args: any[]) => any>(fn: T, deps: unknown[]): T => {
  const ref = useRef<T>((() => new Error('初始化未完成')) as any);

  useEffect(() => {
    ref.current = fn;
  }, [fn, ...deps]);

  return useCallback(
    (...args: Parameters<typeof fn>) => {
      const tempFn = ref.current;
      return tempFn(...args);
    },
    [ref]
  ) as T;
};

export default useEventCallback;
