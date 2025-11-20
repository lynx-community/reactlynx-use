# useUnmount

> **致谢：** Re-export from [react-use](https://github.com/streamich/react-use)

React 生命周期 Hook，在组件即将卸载时调用一个函数。如果你需要同时使用挂载和卸载函数，请使用 `useLifecycles`。

## 示例

```tsx
import { useUnmount } from "@lynx-js/react-use";

const Demo = () => {
  useUnmount(() => {
    console.log("UNMOUNTED");
  });
  return null;
};
```

## 类型定义

```ts
declare const useUnmount: (fn: () => any) => void;
```
