# useLifecycles

> **致谢：** Re-export from [react-use](https://github.com/streamich/react-use)

React 生命周期 Hook，用于在组件挂载时调用 `mount` 回调，在组件卸载时调用 `unmount` 回调

## 示例

```tsx
import { useLifecycles } from "@lynx-js/react-use";

const Demo = () => {
  useLifecycles(
    () => console.log("MOUNTED"),
    () => console.log("UNMOUNTED")
  );
  return null;
};
```

## 类型定义

```ts
declare const useLifecycles: (mount: any, unmount?: any) => void;
```