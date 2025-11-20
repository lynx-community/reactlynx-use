# useEffectOnce

> **致谢：** Re-export from [react-use](https://github.com/streamich/react-use)

仅运行一次的 [`useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect)

## 示例

```tsx
import { useEffectOnce } from "@lynx-js/react-use";

const Demo = () => {
  useEffectOnce(() => {
    console.log("Running effect once on mount");

    return () => {
      console.log("Running clean-up of effect on unmount");
    };
  });

  return null;
};
```

## 类型定义

```ts
import type { EffectCallback } from "@lynx-js/react";

declare const useEffectOnce: (effect: EffectCallback) => void;
```