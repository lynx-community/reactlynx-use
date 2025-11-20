# useQueue

> **致谢：** Re-export from [react-use](https://github.com/streamich/react-use)

React 状态 Hook，实现简单的 FIFO（先进先出）队列。

## 示例

```tsx
import { useQueue } from "@lynx-js/react-use";

const Demo = () => {
  const { add, remove, first, last, size } = useQueue();

  return (
    <view>
      <view>
        <text>first: {first}</text>
      </view>
      <view>
        <text>last: {last}</text>
      </view>
      <view>
        <text>size: {size}</text>
      </view>
      <view bindtap={() => add((last || 0) + 1)}>Add</view>
      <view bindtap={() => remove()}>Remove</view>
    </view>
  );
};
```

## 类型定义

```ts
interface QueueMethods<T> {
  add: (item: T) => void;
  remove: () => T;
  first: T;
  last: T;
  size: number;
}
declare const useQueue: <T>(initialValue?: T[]) => QueueMethods<T>;
```