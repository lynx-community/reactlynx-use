# createMemo

> **Credit:** Re-export from [react-use](https://github.com/streamich/react-use)

Hook factory, receives a function to be memoized, returns a memoized React hook, which receives the same arguments and returns the same result as the original function.

## Usage

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

## Type Declarations

```ts
declare function createMemo<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => ReturnType<T>;
```