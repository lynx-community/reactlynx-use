// biome-ignore-all lint/suspicious/noExplicitAny: need any here

import { useCallback, useEffect, useRef } from '@lynx-js/react';

export type UseTimeoutFnReturn = [() => boolean | null, () => void, () => void];

export default function useTimeoutFn(
  fn: (...args: any[]) => any,
  delay: number = 0,
): UseTimeoutFnReturn {
  'background only';

  const ready = useRef<boolean | null>(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const callback = useRef(fn);

  const isReady = useCallback(() => ready.current, []);

  const set = useCallback(() => {
    ready.current = false;
    timeout.current && clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      ready.current = true;
      callback.current();
    }, delay);
  }, [delay]);

  const clear = useCallback(() => {
    ready.current = null;
    timeout.current && clearTimeout(timeout.current);
  }, []);

  useEffect(() => {
    callback.current = fn;
  }, [fn]);

  useEffect(() => {
    set();

    return clear;
  }, [delay]);

  return [isReady, clear, set];
}
