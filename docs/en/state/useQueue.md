# useQueue

> **Credit:** Re-export from [react-use](https://github.com/streamich/react-use)

React state hook implements simple FIFO queue.

## Usage

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

## Type Declarations

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