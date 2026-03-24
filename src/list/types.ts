import type { ListScrollEvent, ListScrollToLowerEvent, ListScrollToUpperEvent } from "@lynx-js/types";

// list attributes supported by Lynx
export type ListScrollEventAttrsBag = {
  "scroll-event-throttle"?: number;
  "upper-threshold-item-count"?: number;
  "lower-threshold-item-count"?: number;
};

export interface IUseListScrollEventHandlers {
  onScroll?: (e: ListScrollEvent) => void;
  onScrollToUpper?: (e: ListScrollToUpperEvent) => void;
  onScrollToLower?: (e: ListScrollToLowerEvent) => void;
}

export interface IUseListScrollEventOptions {
  filterScrollToLowerEventWithEventSource?: boolean;
  filterScrollToUpperEventWithEventSource?: boolean;
  scrollEventThrottle?: number;
  upperThresholdItemCount?: number;
  lowerThresholdItemCount?: number;
}

export interface IUseListScrollEventReturn {
  listScrollEventsAndAttrs: {
    bindscroll?: (e: ListScrollEvent) => void;
    bindscrolltoupper?: (e: ListScrollToUpperEvent) => void;
    bindscrolltolower?: (e: ListScrollToLowerEvent) => void;
  } & ListScrollEventAttrsBag;
}
