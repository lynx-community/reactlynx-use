# usePointerEvent

用于将 [`TouchEvent`](https://lynxjs.org/api/lynx-api/event/touch-event.html) 与 [`MouseEvent`](https://lynxjs.org/api/lynx-api/event/mouse-event.html) 统一为 `PointerEvent` 的 hook，便于跨平台处理指针事件。

## 示例

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

## 类型定义

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

回调前缀会映射到对应的事件绑定模式：

* `onPointerDown` -> `bindmousedown` 和 `bindtouchstart`
* `catchPointerDown` -> `catchmousedown` 和 `catchtouchstart`
* `captureBindPointerDown` -> `capture-bindmousedown` 和 `capture-bindtouchstart`
* `captureCatchPointerDown` -> `capture-catchmousedown` 和 `capture-catchtouchstart`

追加 `MT` 可以使用主线程版本，例如 `captureCatchPointerDownMT` 会映射到 `main-thread:capture-catchmousedown` 和 `main-thread:capture-catchtouchstart`。
