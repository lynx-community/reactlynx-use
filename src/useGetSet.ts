import { type Dispatch, useMemo, useRef } from '@lynx-js/react';
import { type IHookStateInitAction, type IHookStateSetAction, resolveHookState } from './misc/hookState.js';
import useUpdate from './useUpdate.js';

export default function useGetSet<S>(
  initialState: IHookStateInitAction<S>
): [get: () => S, set: Dispatch<IHookStateSetAction<S>>] {
  const state = useRef(resolveHookState(initialState));
  const update = useUpdate();

  return useMemo(
    () => [
      () => state.current as S,
      (newState: IHookStateSetAction<S>) => {
        state.current = resolveHookState(newState, state.current);
        update();
      },
    ],
    []
  );
}
