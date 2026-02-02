# useUpdateEffect

> **致谢：** Re-export from [react-use](https://github.com/streamich/react-use)

React effect Hook，忽略第一次调用（例如在挂载时）。其签名与 `useEffect` Hook 完全相同。

## 示例

```tsx
import { useEffect } from "@lynx-js/react";
import { useUpdateEffect } from "@lynx-js/react-use";

const Demo = () => {
  const [count, setCount] = React.useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((count) => count + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useUpdateEffect(() => {
    console.log("count", count); // will only show 1 and beyond

    return () => {
      // *OPTIONAL*
      // do something on unmount
    };
  }); // you can include deps array if necessary

  return <view>Count: {count}</view>;
};
```

## 类型定义

```ts
import type { useEffect } from "@lynx-js/react";

declare const useUpdateEffect: typeof useEffect;
```
