import { useCallback, useState } from '@lynx-js/react';
import { type Draft, freeze, produce } from 'immer';

export type DraftFunction<S> = (draft: Draft<S>) => void;
export type Updater<S> = (arg: S | DraftFunction<S>) => void;
export type ImmerHook<S> = [S, Updater<S>];

/**
 * A hook to use immer as a React hook to manipulate state.
 *
 * @param initialValue - The initial value of the state, or a function that returns the initial value.
 * @returns A tuple containing the current state and a function to update the state.
 *
 * @example
 * ```tsx
 * const [person, updatePerson] = useImmer({
 *   name: "Sarah",
 *   age: 25
 * });
 *
 * function updateName(name) {
 *   updatePerson(draft => {
 *     draft.name = name;
 *   });
 * }
 * ```
 */
export function useImmer<S>(initialValue: S | (() => S)): ImmerHook<S> {
  const [val, updateValue] = useState(() =>
    freeze(
      typeof initialValue === 'function'
        ? (initialValue as () => S)()
        : initialValue,
      true,
    ),
  );

  return [
    val,
    useCallback((updater: S | DraftFunction<S>) => {
      if (typeof updater === 'function') {
        // If the updater is a function, we assume it's an Immer producer
        updateValue(produce(updater as DraftFunction<S>));
      } else {
        // Otherwise, we just set the value directly
        updateValue(freeze(updater));
      }
    }, []),
  ];
}

export default useImmer;
