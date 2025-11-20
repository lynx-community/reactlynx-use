# useMainThreadImperativeHandle

主线程版本的 React 的 [useImperativeHandle](https://react.dev/reference/react/useImperativeHandle)，用于在主线程向父组件暴露命令式方法。

## 示例

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

## 类型定义

```ts
import type { MainThreadRef } from "@lynx-js/react";

function useMainThreadImperativeHandle<T, R extends T>(
  ref: MainThreadRef<T> | undefined,
  createHandle: () => R,
  deps: readonly unknown[]
): void;
```