# useListScrollEvent

A Hook for handling `List` scroll events, with support for filtering non-user-triggered scroll events.

## Basic Example

```tsx
import { useListScrollEvent } from "@lynx-js/react-use";

export function List() {
  const { listScrollEventsAndAttrs } = useListScrollEvent({
    onScroll: (e) => {
      console.log("on scroll", e);
    },
    onScrollToUpper: (e) => {
      console.log("on scroll to upper", e);
    },
    onScrollToLower: (e) => {
      console.log("on scroll to lower", e);
    }
  });

  return (
    <list {...listScrollEventsAndAttrs} />
  );
}
```

## Example With Options

```tsx
import { useListScrollEvent } from "@lynx-js/react-use";

export function List() {
  const { listScrollEventsAndAttrs } = useListScrollEvent({
    onScroll: (e) => {
      console.log("on scroll", e);
    },
    onScrollToUpper: (e) => {
      console.log("on scroll to upper", e);
    },
    onScrollToLower: (e) => {
      console.log("on scroll to lower", e);
    }
  }, {
    filterScrollToLowerEventWithEventSource: true,
    filterScrollToUpperEventWithEventSource: true,
    scrollEventThrottle: 50,
    upperThresholdItemCount: 2,
    lowerThresholdItemCount: 2
  });

  return (
    <list {...listScrollEventsAndAttrs} />
  );
}
```

## Type Definition

```ts
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
```
