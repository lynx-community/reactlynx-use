import { type DependencyList, useEffect } from '@lynx-js/react';
import type { FunctionReturningPromise } from './useAsyncFn.js';
import useAsyncFn from './useAsyncFn.js';

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
