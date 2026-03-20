import type { ListScrollEvent, ListScrollToLowerEvent, ListScrollToUpperEvent } from "@lynx-js/types";

// list attributes supported by Lynx
export type ListScrollAttrBag = {
  "scroll-event-throttle"?: number;
  "upper-threshold-item-count"?: number;
  "lower-threshold-item-count"?: number;
};

export interface IUseListScrollEventOptions<
  EA extends Record<string, string | number | boolean | undefined>
> {
  attrs?: ListScrollAttrBag & EA;
  filterScrollToLowerEventWithEventSource?: boolean;
  filterScrollToUpperEventWithEventSource?: boolean;
  onScroll?: (e: ListScrollEvent) => void;
  onScrollToUpper?: (e: ListScrollToUpperEvent) => void;
  onScrollToLower?: (e: ListScrollToLowerEvent) => void;
}

export interface IUseListScrollEventReturn<
  EA extends Record<string, string | number | boolean | undefined>
> {
  listScrollEventsAndAttrs: {
    bindscroll?: (e: ListScrollEvent) => void;
    bindscrolltoupper?: (e: ListScrollToUpperEvent) => void;
    bindscrolltolower?: (e: ListScrollToLowerEvent) => void;
  } & ListScrollAttrBag & EA;
}
