# createMemo

> **致谢：** Re-export from [react-use](https://github.com/streamich/react-use)

Hook 工厂函数，接收一个需要被记忆化的函数，返回一个记忆化的 React Hook，该 Hook 接收与原函数相同的参数并返回相同的结果。

## 示例

```tsx
import { createMemo } from "@lynx-js/react-use";

const fibonacci = (n) => {
  if (n === 0) return 0;
  if (n === 1) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

const useMemoFibonacci = createMemo(fibonacci);

const Demo = () => {
  const result = useMemoFibonacci(10);

  return <view>fib(10) = {result}</view>;
};
```

## 类型定义

```ts
declare function createMemo<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => ReturnType<T>;
```