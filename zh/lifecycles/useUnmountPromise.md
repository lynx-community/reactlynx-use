# useUnmountPromise

> **致谢：** Re-export from [react-use](https://github.com/streamich/react-use)

一个生命周期 Hook，提供一个高阶 Promise，如果组件卸载则该 Promise 不会 resolve。

## 示例

```tsx
import { useUnmountPromise } from "@lynx-js/react-use";

const Demo = () => {
  const mounted = useUnmountPromise();
  useEffect(async () => {
    await mounted(someFunction()); // Will not resolve if component un-mounts.
  });
};
```

## 类型定义

```ts
type Race = <P extends Promise<any>, E = any>(
  promise: P,
  onError?: (error: E) => void
) => P;

declare const useUnmountPromise: () => Race;
```
