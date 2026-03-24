import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "@lynx-js/react";
import type { ListScrollEvent, ListScrollToLowerEvent, ListScrollToUpperEvent } from "@lynx-js/types";
import type { IUseListScrollEventHandlers, IUseListScrollEventOptions, IUseListScrollEventReturn, ListScrollEventAttrsBag } from "./types.js";

export function useListScrollEvent(
  handlers: IUseListScrollEventHandlers = {} as IUseListScrollEventHandlers,
  options?: IUseListScrollEventOptions
): IUseListScrollEventReturn {
  const { onScroll, onScrollToLower, onScrollToUpper } = handlers;
  const {
    filterScrollToLowerEventWithEventSource = true,
    filterScrollToUpperEventWithEventSource = true,
    scrollEventThrottle,
    upperThresholdItemCount,
    lowerThresholdItemCount,
  } = options ?? {};

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
    const listAttrs: ListScrollEventAttrsBag = {};
    if (typeof scrollEventThrottle === "number") {
      listAttrs["scroll-event-throttle"] = scrollEventThrottle;
    }
    if (typeof upperThresholdItemCount === "number") {
      listAttrs["upper-threshold-item-count"] = upperThresholdItemCount;
    }
    if (typeof lowerThresholdItemCount === "number") {
      listAttrs["lower-threshold-item-count"] = lowerThresholdItemCount;
    }

    const props = { ...listAttrs } as IUseListScrollEventReturn["listScrollEventsAndAttrs"];
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
    scrollEventThrottle,
    upperThresholdItemCount,
    lowerThresholdItemCount,
    onScroll,
    onScrollToLower,
    onScrollToUpper,
    handleScroll,
    handleScrollToLower,
    handleScrollToUpper,
  ]);

  return { listScrollEventsAndAttrs };
}
