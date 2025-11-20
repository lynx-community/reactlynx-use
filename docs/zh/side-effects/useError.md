# useError

> **致谢：** Re-export from [react-use](https://github.com/streamich/react-use)

React 副作用 Hook，返回一个错误分发器。

## 示例

```tsx
import { useError } from "@lynx-js/react-use";

const Demo = () => {
  const dispatchError = useError();

  const tapHandler = () => {
    "background only";
    dispatchError(new Error("Some error!"));
  };

  return <view bindtap={tapHandler}>Click me to throw</view>;
};

// In parent app
const App = () => (
  <ErrorBoundary>
    <Demo />
  </ErrorBoundary>
);
```

## 类型定义
```ts
declare const useError: () => (err: Error) => void;
```