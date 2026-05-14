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

// Alias: useTouchEvent provides the same API
```

Callback prefixes map to event binding modes:

* `onTouchStart` -> `bindtouchstart` and `bindmousedown`
* `catchTouchStart` -> `catchtouchstart` and `catchmousedown`
* `captureBindTouchStart` -> `capture-bindtouchstart` and `capture-bindmousedown`
* `captureCatchTouchStart` -> `capture-catchtouchstart` and `capture-catchmousedown`

Append `MT` to use the main-thread variants, for example `captureCatchTouchStartMT` maps to `main-thread:capture-catchtouchstart` and `main-thread:capture-catchmousedown`.
