# useMountedState

> **致谢：** Re-export from [react-use](https://github.com/streamich/react-use)

> **注意！**：尽管名称中包含 `State`，但**_此 Hook 不会导致组件重新渲染_**。  
> 此组件旨在用于避免在已卸载的组件上更新状态。

生命周期 Hook，提供检查组件挂载状态的能力。  
返回一个函数，如果组件已挂载则返回 `true`，否则返回 `false`。

## 示例

```tsx
import { useEffect } from "@lynx-js/react";
import { useMountedState } from "@lynx-js/react-use";

const Demo = () => {
  const isMounted = useMountedState();

  useEffect(() => {
    setTimeout(() => {
      if (isMounted()) {
        // ...
      } else {
        // ...
      }
    }, 1000);
  });
};
```

## 类型定义

```ts
function useMountedState(): () => boolean;
```