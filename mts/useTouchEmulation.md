# useTouchEmulation

A Hook synthesizes [`TouchEvent`](https://lynxjs.org/api/lynx-api/event/touch-event.html) from [`MouseEvent`](https://lynxjs.org/api/lynx-api/event/mouse-event.html), so existing touch handlers can work seamlessly with mouse input. Useful for migration from touch-only code.

## Usage

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

## Type Declarations

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

// Alias: useTouchEvent provides the same API
```
