# useTapAway

在目标元素外发生 `tap` 时触发回调的 Hook（Lynx 版 click-away）。

## 示例

```tsx
import { useRef } from "@lynx-js/react";
import { useTapAway } from "@lynx-js/react-use";

function Demo() {
  const boxRef = useRef(null);

  useTapAway(boxRef, () => {
    console.log("OUTSIDE TAP");
  });

  return (
    <view
      ref={boxRef}
      style={{
        width: 200,
        height: 200,
        background: "red",
      }}
    />
  );
}
```

## API

```ts
type TapAwayEvent = {
  target?: unknown;
  detail?: { target?: unknown };
};

function useTapAway<E extends TapAwayEvent = TapAwayEvent>(
  ref: RefObject<unknown> | Array<RefObject<unknown>>,
  onTapAway: (event: E) => void,
  events?: string[], // 默认 ['bindtap']
): void;
```

### 参数
- `ref`：目标元素的 ref，支持单个或数组。
- `onTapAway`：当 tap 发生在所有 ref 外部时调用。
- `events`：可选，自定义监听的事件名数组，默认 `['bindtap']`。

### 说明
- 运行在后台线程，通过 `GlobalEventEmitter` 监听 tap 事件。
- 命中判定支持 `contains`/节点相等/`uid`（或 `dataset.uid`/`id`） 比对。***
