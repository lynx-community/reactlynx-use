# useSet

> **致谢：** Re-export from [react-use](https://github.com/streamich/react-use)

React 状态 Hook，用于跟踪 [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)。

## 示例

```tsx
import { useSet } from "react-use";

const Demo = () => {
  const [set, { add, has, remove, toggle, reset, clear }] = useSet(
    new Set(["hello"])
  );

  return (
    <view>
      <view bindtap={() => add(String(Date.now()))}>Add</view>
      <view bindtap={() => reset()}>Reset</button>
      <view bindtap={() => clear()}>Clear</button>
      <view bindtap={() => remove("hello")}>
        Remove 'hello'
      </view>
      <view bindtap={() => toggle("hello")}>Toggle hello</view>
      <view>{JSON.stringify(Array.from(set), null, 2)}</view>
    </view>
  );
};
```

## 类型定义

```ts
interface StableActions<K> {
  add: (key: K) => void;
  remove: (key: K) => void;
  toggle: (key: K) => void;
  reset: () => void;
  clear: () => void;
}
interface Actions<K> extends StableActions<K> {
  has: (key: K) => boolean;
}
declare const useSet: <K>(initialSet?: Set<K>) => [Set<K>, Actions<K>];
```