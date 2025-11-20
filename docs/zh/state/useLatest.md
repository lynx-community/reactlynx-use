# useLatest

> **致谢：** Re-export from [react-use](https://github.com/streamich/react-use)

React 状态 Hook，返回最新的状态，如 [React hooks FAQ](https://reactjs.org/docs/hooks-faq.html#why-am-i-seeing-stale-props-or-state-inside-my-function) 中所述。

这主要用于在异步回调中获取某些 props 或 state 的最新值，而不是回调创建时的值。

## 示例

```tsx
import { useState } from "@lynx-js/react";
import { useLatest } from "@lynx-js/react-use";

const Demo = () => {
  const [count, setCount] = useState(0);
  const latestCount = useLatest(count);

  function handleTap() {
    setTimeout(() => {
      console.log(`Latest count value: ${latestCount.current}`);
    }, 3000);
  }

  return (
    <view>
      <text>You clicked {count} times</text>
      <view bindtap={() => setCount(count + 1)}>Click me</view>
      <view bindtap={handleTap}>Show latestCount</view>
    </view>
  );
};
```

## 类型定义

```ts
declare const useLatest: <T>(value: T) => {
  readonly current: T;
};
```