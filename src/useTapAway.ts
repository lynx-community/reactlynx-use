// biome-ignore-all lint/suspicious/noExplicitAny: need any here for Lynx node/target shapes
import type { RefObject } from "@lynx-js/react";
import { useEffect, useMemo, useRef } from "@lynx-js/react";

const defaultEvents = ["bindtap"];

export type TapAwayEvent = {
  target?: unknown;
  detail?: { target?: unknown };
};
type TapAwayRef = RefObject<unknown> | Array<RefObject<unknown>>;

const useTapAway = <E extends TapAwayEvent = TapAwayEvent>(
  ref: TapAwayRef,
  onTapAway: (event: E) => void,
  events: string[] = defaultEvents,
) => {
  const callbackRef = useRef(onTapAway);
  const refs = useMemo(() => (Array.isArray(ref) ? ref : [ref]), [ref]);

  useEffect(() => {
    callbackRef.current = onTapAway;
  }, [onTapAway]);

  useEffect(() => {
    const emitter = lynx?.getJSModule?.("GlobalEventEmitter");
    if (!emitter || !refs.length) return;

    const handler = (event: unknown) => {
      const e = event as TapAwayEvent;
      const target = e.target ?? e.detail?.target;

      const isInside = refs.some((r) => {
        const node = r?.current as any;
        if (!node) return false;
        if (node === target) return true;
        if (
          target
          && typeof node.contains === "function"
        ) {
          try {
            if (node.contains(target)) return true;
          } catch {
            // contains may throw if target isn't a node; fall back to uid/id match
          }
        }
        const nodeId = node?.dataset?.uid ?? node?.uid ?? node?.id;
        const targetId = target?.dataset?.uid ?? target?.uid ?? target?.id;
        return Boolean(nodeId && targetId && nodeId === targetId);
      });

      if (!isInside) {
        callbackRef.current?.(event as E);
      }
    };

    events.forEach((eventName) => {
      emitter?.addListener?.(eventName, handler);
    });
    return () => {
      events.forEach((eventName) => {
        emitter?.removeListener?.(eventName, handler);
      });
    };
  }, [refs, events]);
};

export default useTapAway;
