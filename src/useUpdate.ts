import { useReducer } from '@lynx-js/react';

const updateReducer = (num: number): number => (num + 1) % 1_000_000;

export default function useUpdate(): () => void {
  'background only';

  const [, update] = useReducer(updateReducer, 0);

  return update;
}
