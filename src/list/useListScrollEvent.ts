import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "@lynx-js/react";
import type { ListScrollEvent, ListScrollToLowerEvent, ListScrollToUpperEvent } from "@lynx-js/types";
import type { IUseListScrollEventOptions, IUseListScrollEventReturn, ListScrollAttrBag } from "./types.js";

export function useListScrollEvent<
  EA extends Record<string, string | number | boolean | undefined>
>(
  options: IUseListScrollEventOptions<EA>
): IUseListScrollEventReturn<EA> {
  const { attrs, filterScrollToLowerEventWithEventSource = true, 
    filterScrollToUpperEventWithEventSource = true, 
    onScroll, onScrollToLower, onScrollToUpper } = options;

  // Keep latest callbacks to avoid re-creating gate or handlers
  const onScrollRef = useRef(onScroll);
  const onScrollToLowerRef = useRef(onScrollToLower);
  const onScrollToUpperRef = useRef(onScrollToUpper);

  useEffect(() => {
    onScrollRef.current = onScroll;
  }, [onScroll]);
  useEffect(() => {
    onScrollToLowerRef.current = onScrollToLower;
  }, [onScrollToLower]);
  useEffect(() => {
    onScrollToUpperRef.current = onScrollToUpper;
  }, [onScrollToUpper]);

  const handleScroll = useCallback((detail: ListScrollEvent) => {
    onScrollRef.current?.(detail);
  }, []);

  const handleScrollToLower = useCallback((event: ListScrollToLowerEvent) => {
    if (filterScrollToLowerEventWithEventSource) {
      const eventSource = event?.detail?.eventSource;
      if (eventSource === 0 || eventSource === 1) {
        return;
      }
    }
    onScrollToLowerRef.current?.(event);
  }, [filterScrollToLowerEventWithEventSource]);

  const handleScrollToUpper = useCallback((event: ListScrollToUpperEvent) => {
    if (filterScrollToUpperEventWithEventSource) {
      const eventSource = event?.detail?.eventSource;
      if (eventSource === 0 || eventSource === 1) {
        return;
      }
    }
    onScrollToUpperRef.current?.(event);
  }, [filterScrollToUpperEventWithEventSource]);

  const listScrollEventsAndAttrs = useMemo(() => {
    const baseAttrs = (attrs ?? {}) as ListScrollAttrBag & EA;
    const props = { ...baseAttrs } as IUseListScrollEventReturn<EA>['listScrollEventsAndAttrs'];
    if (onScroll) {
      props.bindscroll = handleScroll;
    }
    if (onScrollToLower) {
      props.bindscrolltolower = handleScrollToLower;
    }
    if (onScrollToUpper) {
      props.bindscrolltoupper = handleScrollToUpper;
    }
    return props;
  },
    // Note: We include onScroll/onScrollToLower/onScrollToUpper in the dependency array
    // because we dynamically bind these events based on their presence.
    // If omitted, useMemo wouldn't detect changes when the parent component dynamically
    // passes or removes event handlers later, leading to stale event bindings.
  [
    attrs, onScroll, onScrollToLower, onScrollToUpper, 
    handleScroll, handleScrollToLower, handleScrollToUpper
  ]);

  return { listScrollEventsAndAttrs };
}
