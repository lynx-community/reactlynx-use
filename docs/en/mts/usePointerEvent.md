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
type PointerAction = 'pointerdown' | 'pointermove' | 'pointerup';

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

function usePointerEvent({ onPointerDown, onPointerUp, onPointerMove, onPointerUpMT, onPointerMoveMT, onPointerDownMT, }: {
    onPointerDown?: (event: CustomPointerEvent) => void;
    onPointerUp?: (event: CustomPointerEvent) => void;
    onPointerMove?: (event: CustomPointerEvent) => void;
    onPointerUpMT?: (event: CustomPointerEventMT) => void;
    onPointerMoveMT?: (event: CustomPointerEventMT) => void;
    onPointerDownMT?: (event: CustomPointerEventMT) => void;
}): {
    'bindmousedown'?: (e: MouseEvent) => void;
    'bindtouchstart'?: (e: TouchEvent) => void;
    'bindmousemove'?: (e: MouseEvent) => void;
    'bindtouchmove'?: (e: TouchEvent) => void;
    'bindmouseup'?: (e: MouseEvent) => void;
    'bindtouchend'?: (e: TouchEvent) => void;
    'main-thread:bindmousedown'?: (e: MainThread.MouseEvent) => void;
    'main-thread:bindtouchstart'?: (e: MainThread.TouchEvent) => void;
    'main-thread:bindmousemove'?: (e: MainThread.MouseEvent) => void;
    'main-thread:bindtouchmove'?: (e: MainThread.TouchEvent) => void;
    'main-thread:bindmouseup'?: (e: MainThread.MouseEvent) => void;
    'main-thread:bindtouchend'?: (e: MainThread.TouchEvent) => void;
};

```