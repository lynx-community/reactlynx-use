# useListScrollEvent

List 滚动事件处理 Hook，支持过滤非用户触发的滚动事件。

## 示例

```tsx
import { useListScrollEvent } from "@lynx-js/react-use";

export function List() {
  const { listScrollEventsAndAttrs } = useListScrollEvent({
    attrs: {
      "scroll-event-throttle": 50,
      "upper-threshold-item-count": 2,
      "lower-threshold-item-count": 2,
    },
    filterScrollToLowerEventWithEventSource: true,
    filterScrollToUpperEventWithEventSource: true,
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

## 类型定义

```ts
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
```
