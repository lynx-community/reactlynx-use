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
    <page trigger-global-event={true}>
      <view
        ref={boxRef}
        style={{
          width: 200,
          height: 200,
          background: "red",
        }}
      />
    </page>
  );
}
```

## API

```ts
type TapAwayEvent = {
  target?: unknown;
};

function useTapAway<E extends TapAwayEvent = TapAwayEvent>(
  ref: RefObject<unknown> | Array<RefObject<unknown>>,
  onTapAway: (event: E) => void,
  eventName?: "tap", // 默认 "tap"
): void;
```

### 参数
- `ref`：目标元素的 ref，支持单个或数组。
- `onTapAway`：当 tap 发生在所有 ref 外部时调用。
- `eventName`：可选，默认 `"tap"`。

### 说明
- 运行在后台线程，通过 `GlobalEventEmitter` 监听 tap 事件。
- 命中判定仅基于 `event.target`，支持节点相等/`uid` 比对，并在需要时使用路径后缀匹配兜底。
- 请确保页面根节点设置了 `trigger-global-event={true}` 以转发 tap 事件到 `GlobalEventEmitter`。
- `useTapAway` 目前只监听 `tap`。
