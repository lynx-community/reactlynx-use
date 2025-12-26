// biome-ignore-all lint/suspicious/noExplicitAny: need any here

import { type DependencyList, useEffect } from '@lynx-js/react';
import useTimeoutFn from './useTimeoutFn.js';

export type UseDebounceReturn = [() => boolean | null, () => void];

export default function useDebounce(
  fn: (...args: any[]) => any,
  ms: number = 0,
  deps: DependencyList = [],
): UseDebounceReturn {
  'background only';

  const [isReady, cancel, reset] = useTimeoutFn(fn, ms);

  useEffect(reset, deps);

  return [isReady, cancel];
}
