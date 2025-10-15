// biome-ignore-all lint/suspicious/noExplicitAny: need any here

import { useEffect, useMemo, useRef } from '@lynx-js/react';

/**
 * `useEventListener` help you `addListener` as early as possible.
 * 
 *  Note: Renamed from `useLynxGlobalEventListener` in `@lynx-js/react`
 *
 * @example
 *
 * Use this hooks to listen to event 'exposure' and event 'disexposure'
 *
 * ```jsx
 * function App() {
 *   useEventListener('exposure', (e) => {
 *     console.log("exposure", e)
 *   })
 *   useEventListener('disexposure', (e) => {
 *     console.log("disexposure", e)
 *   })
 *   return (
 *     <view
 *       style='width: 100px; height: 100px; background-color: red;'
 *       exposure-id='a'
 *     />
 *   )
 * }
 * ```
 *
 * @param eventName - Event name to listen
 * @param listener - Event handler
 * @public
 */
export default function useEventListener<T extends (...args: any[]) => void>(
  eventName: string,
  listener: T,
): void {
  'background only';

  const previousArgsRef = useRef<[string, T]>();

  useMemo(() => {
    if (previousArgsRef.current) {
      const [eventName, listener] = previousArgsRef.current;
      lynx
        .getJSModule('GlobalEventEmitter')
        .removeListener(eventName, listener);
    }
    lynx.getJSModule('GlobalEventEmitter').addListener(eventName, listener);
    previousArgsRef.current = [eventName, listener];
  }, [eventName, listener]);

  useEffect(() => {
    return () => {
      if (previousArgsRef.current) {
        const [eventName, listener] = previousArgsRef.current;
        lynx
          .getJSModule('GlobalEventEmitter')
          .removeListener(eventName, listener);
      }
    };
  }, []);
}
