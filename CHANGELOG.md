# @lynx-js/react-use

## 0.0.7

### Patch Changes

- 37ec953: Fix an issue for `useTouchEmulation` that emulated `touchMove` will be triggered by mouseMove, even when mouseDown not called
- 37ec953: Add proper memoization for `usePointerEvent` and `useTouchEmulation`, so reRender will not triggered unintentionally

## 0.0.6

### Patch Changes

- 9db882a: Add `usePointerEvent` and `useTouchEmulation` to handle both `TouchEvent` and `MouseEvent`.

  ```tsx
  import {
    usePointerEvent,
    CustomPointerEvent,
    CustomPointerEventMT,
  } from "@lynx-js/react-use";

  function App() {
    const pointerHandlers = usePointerEvent({
      onPointerDown: (event: CustomPointerEvent) => {
        console.log("Pointer down", event);
      },
      onPointerDownMT: (event: CustomPointerEventMT) => {
        "main thread";
        console.log("Pointer down on main thread", event);
      },
    });

    return <view {...pointerHandlers}></view>;
  }
  ```

## 0.0.5

### Patch Changes

- 9803c0a: Use deep import paths for `react-use`.

## 0.0.4

### Patch Changes

- 90dce6d: Introduce exposure hooks:

  - `useExposureForNode`: Node-level exposure hook with optional admission gating.
  - `useExposureForPage`: Page-level exposure hook handling multiple items via `GlobalEventEmitter`.
  - `useStayTime`: Tracks element visibility duration with optional manual control.

## 0.0.3

### Patch Changes

- 8b884d7: Add `package.json#peerDependencies` & set `package.json#sideEffects` to `false`

## 0.0.2

### Patch Changes

- da2238e: Introduce `useVelocity`: a hook that tracks touch velocity and direction with smoothing support.
