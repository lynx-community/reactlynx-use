# useMainThreadImperativeHandle

A Hook for exposing imperative handles to parent components on the main-thread. This is the main-thread version of
React's [useImperativeHandle](https://react.dev/reference/react/useImperativeHandle), allowing you to trigger component methods that run on the main-thread.

## Usage

```tsx
import { useMainThreadRef } from "@lynx-js/react";
import type { MainThreadRef } from "@lynx-js/react";
import { useMainThreadImperativeHandle } from "@lynx-js/react-use";

interface InternalCompMTRef {
  start: () => void;
}

function InternalComp({
  "main-thread:ref": MTRef,
}: {
  "main-thread:ref"?: MainThreadRef<InternalCompMTRef | null>;
}) {
  function start() {
    "main thread";
    console.log("MT Start");
  }

  useMainThreadImperativeHandle(
    MTRef,
    () => {
      "main thread";
      return {
        start: start,
      };
    },
    []
  );

  return (
    <view>
      <text>Internal Comp</text>
    </view>
  );
}

function App() {
  const internalMTRef = useMainThreadRef<InternalCompMTRef>(null);

  return (
    <view>
      <InternalComp main-thread:ref={internalMTRef} />
      <view
        main-thread:bindtap={() => {
          "main thread";
          internalMTRef.current?.start();
        }}
      >
        <text>Click to Trigger</text>
      </view>
    </view>
  );
}
```

## Type Declarations

```ts
import type { MainThreadRef } from "@lynx-js/react";

function useMainThreadImperativeHandle<T, R extends T>(
  ref: MainThreadRef<T> | undefined,
  createHandle: () => R,
  deps: readonly unknown[]
): void;
```