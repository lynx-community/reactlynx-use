import { type InitData, useInitData, useState } from '@lynx-js/react';

/**
 * A hook that initializes state with Lynx's initData.
 * Returns a stateful value and a function to update it.
 *
 * @example
 * ```tsx
 * const [data, setData] = useSetInitData();
 * ```
 */
export function useSetInitData() {
  const nativeInitData = useInitData();

  const [data, setData] = useState<InitData>(nativeInitData);

  return [data, setData] as const;
}
