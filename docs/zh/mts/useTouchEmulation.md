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
type TouchAction = 'touchstart' | 'touchmove' | 'touchend';

function useTouchEmulation({
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onTouchStartMT,
  onTouchMoveMT,
  onTouchEndMT,
}: {
  onTouchStart?: (event: TouchEvent) => void;
  onTouchMove?: (event: TouchEvent) => void;
  onTouchEnd?: (event: TouchEvent) => void;
  onTouchStartMT?: (event: MainThread.TouchEvent) => void;
  onTouchMoveMT?: (event: MainThread.TouchEvent) => void;
  onTouchEndMT?: (event: MainThread.TouchEvent) => void;
}): {
  'bindtouchstart'?: (e: TouchEvent) => void;
  'bindmousedown'?: (e: MouseEvent) => void;
  'bindtouchmove'?: (e: TouchEvent) => void;
  'bindmousemove'?: (e: MouseEvent) => void;
  'bindtouchend'?: (e: TouchEvent) => void;
  'bindmouseup'?: (e: MouseEvent) => void;
  'main-thread:bindtouchstart'?: (e: MainThread.TouchEvent) => void;
  'main-thread:bindmousedown'?: (e: MainThread.MouseEvent) => void;
  'main-thread:bindtouchmove'?: (e: MainThread.TouchEvent) => void;
  'main-thread:bindmousemove'?: (e: MainThread.MouseEvent) => void;
  'main-thread:bindtouchend'?: (e: MainThread.TouchEvent) => void;
  'main-thread:bindmouseup'?: (e: MainThread.MouseEvent) => void;
};

// 别名：useTouchEvent 提供相同的 API
```
