# usePointerEvent

A Hook unifies [`TouchEvent`](https://lynxjs.org/api/lynx-api/event/touch-event.html) and [`MouseEvent`](https://lynxjs.org/api/lynx-api/event/mouse-event.html) into `PointerEvent`, to help with handling pointer events in a cross-platform manner.

## Usage

```tsx
import { usePointerEvent, CustomPointerEvent, CustomPointerEventMT } from "@lynx-js/react-use";

function App() {
  const pointerHandlers = usePointerEvent({
    onPointerDown: (event: CustomPointerEvent) => {
      console.log("Pointer down", event);
    },
    onPointerDownMT: (event: CustomPointerEventMT) => {
      'main thread'
      console.log("Pointer down on main thread", event);
    },
  });

  return <view {...pointerHandlers}></view>
}

```

## Type Declarations

```tsx
type PointerAction = 'pointerdown' | 'pointermove' | 'pointerup' | 'pointercancel';
type BindingMode = 'bind' | 'catch' | 'capture-bind' | 'capture-catch';
type PointerCallbackPrefix = 'on' | 'catch' | 'captureBind' | 'captureCatch';
type PointerActionName = 'Down' | 'Move' | 'Up' | 'Cancel';

interface CustomPointerEvent {
    type: PointerAction;
    pointerType: 'mouse' | 'touch';
    x: number;
    y: number;
    pointerId: number;
    isPrimary: boolean;
    pageX?: number;
    pageY?: number;
    clientX?: number;
    clientY?: number;
    button?: number;
    buttons?: number;
    identifier?: number;
    originalEvent: unknown;
}

interface CustomPointerEventMT extends CustomPointerEvent {
    target: MainThread.Element;
    currentTarget: MainThread.Element;
    originalEvent: MainThread.MouseEvent | MainThread.TouchEvent;
}

type PointerCallbackName =
  `${PointerCallbackPrefix}Pointer${PointerActionName}${'' | 'MT'}`;

type TouchEventProp =
  `${BindingMode}${'touchstart' | 'touchmove' | 'touchend' | 'touchcancel'}`;
type MouseEventProp =
  `${BindingMode}${'mousedown' | 'mousemove' | 'mouseup'}`;
type MainThreadEventProp<EventName extends string> =
  `main-thread:${BindingMode}${EventName}`;

function usePointerEvent(options: {
  [K in PointerCallbackName]?: K extends `${string}MT`
    ? (event: CustomPointerEventMT) => void
    : (event: CustomPointerEvent) => void;
}): {
  [K in TouchEventProp]?: (event: TouchEvent) => void;
} & {
  [K in MouseEventProp]?: (event: MouseEvent) => void;
} & {
  [K in MainThreadEventProp<'touchstart' | 'touchmove' | 'touchend' | 'touchcancel'>]?: (event: MainThread.TouchEvent) => void;
} & {
  [K in MainThreadEventProp<'mousedown' | 'mousemove' | 'mouseup'>]?: (event: MainThread.MouseEvent) => void;
};

```

Callback prefixes map to event binding modes:

* `onPointerDown` -> `bindmousedown` and `bindtouchstart`
* `catchPointerDown` -> `catchmousedown` and `catchtouchstart`
* `captureBindPointerDown` -> `capture-bindmousedown` and `capture-bindtouchstart`
* `captureCatchPointerDown` -> `capture-catchmousedown` and `capture-catchtouchstart`

Append `MT` to use the main-thread variants, for example `captureCatchPointerDownMT` maps to `main-thread:capture-catchmousedown` and `main-thread:capture-catchtouchstart`.
