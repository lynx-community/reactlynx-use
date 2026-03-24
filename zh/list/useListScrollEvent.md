# useListScrollEvent

List 滚动事件处理 Hook，支持过滤非用户触发的滚动事件。

## 基础示例

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

## 使用 Options 选项

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

## 类型定义

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
