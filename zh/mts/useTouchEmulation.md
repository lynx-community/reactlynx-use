# useTouchEmulation

用于从 [`MouseEvent`](https://lynxjs.org/api/lynx-api/event/mouse-event.html) 合成 [`TouchEvent`](https://lynxjs.org/api/lynx-api/event/touch-event.html) 的 hook，使现有基于触摸的事件处理逻辑可以无缝兼容鼠标输入，便于从仅触摸代码迁移。

## 示例

```tsx
import { useTouchEmulation } from "@lynx-js/react-use";

function App() {
  const touchHandlers = useTouchEmulation({
    onTouchStart: (event: TouchEvent) => {
      console.log("Touch start", event);
    },
    onTouchStartMT: (event: MainThread.TouchEvent) => {
      'main thread'
      console.log("Touch start on main thread", event);
    },
  });

  return <view {...touchHandlers}></view>
}
```

## 类型定义

```tsx
type TouchAction = 'touchstart' | 'touchmove' | 'touchend' | 'touchcancel';
type BindingMode = 'bind' | 'catch' | 'capture-bind' | 'capture-catch';
type TouchCallbackPrefix = 'on' | 'catch' | 'captureBind' | 'captureCatch';
type TouchActionName = 'Start' | 'Move' | 'End' | 'Cancel';

type TouchCallbackName =
  `${TouchCallbackPrefix}Touch${TouchActionName}${'' | 'MT'}`;

type TouchEventProp = `${BindingMode}${TouchAction}`;
type MouseEventProp =
  `${BindingMode}${'mousedown' | 'mousemove' | 'mouseup'}`;
type MainThreadEventProp<EventName extends string> =
  `main-thread:${BindingMode}${EventName}`;

function useTouchEmulation(options: {
  [K in TouchCallbackName]?: K extends `${string}MT`
    ? (event: MainThread.TouchEvent) => void
    : (event: TouchEvent) => void;
}): {
  [K in TouchEventProp]?: (event: TouchEvent) => void;
} & {
  [K in MouseEventProp]?: (event: MouseEvent) => void;
} & {
  [K in MainThreadEventProp<TouchAction>]?: (event: MainThread.TouchEvent) => void;
} & {
  [K in MainThreadEventProp<'mousedown' | 'mousemove' | 'mouseup'>]?: (event: MainThread.MouseEvent) => void;
};

// 别名：useTouchEvent 提供相同的 API
```

回调前缀会映射到对应的事件绑定模式：

* `onTouchStart` -> `bindtouchstart` 和 `bindmousedown`
* `catchTouchStart` -> `catchtouchstart` 和 `catchmousedown`
* `captureBindTouchStart` -> `capture-bindtouchstart` 和 `capture-bindmousedown`
* `captureCatchTouchStart` -> `capture-catchtouchstart` 和 `capture-catchmousedown`

追加 `MT` 可以使用主线程版本，例如 `captureCatchTouchStartMT` 会映射到 `main-thread:capture-catchtouchstart` 和 `main-thread:capture-catchmousedown`。
