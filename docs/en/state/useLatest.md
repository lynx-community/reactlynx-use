# useLatest

> **Credit:** Re-export from [react-use](https://github.com/streamich/react-use)

React state hook that returns the latest state as described in the [React hooks FAQ](https://reactjs.org/docs/hooks-faq.html#why-am-i-seeing-stale-props-or-state-inside-my-function).

This is mostly useful to get access to the latest value of some props or state inside an asynchronous callback, instead of that value at the time the callback was created from.

## Usage

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

## Type Declarations

```ts
declare const useLatest: <T>(value: T) => {
  readonly current: T;
};
```