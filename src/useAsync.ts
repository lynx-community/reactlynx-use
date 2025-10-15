import { type DependencyList, useEffect } from '@lynx-js/react';
import type { FunctionReturningPromise } from './useAsyncFn';
import useAsyncFn from './useAsyncFn';

export default function useAsync<T extends FunctionReturningPromise>(
  fn: T,
  deps: DependencyList = [],
) {
  'background only';

  const [state, callback] = useAsyncFn(fn, deps, {
    loading: true,
  });

  useEffect(() => {
    callback();
  }, [callback]);

  return state;
}
