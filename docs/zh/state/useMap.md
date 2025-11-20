# useMap

> **致谢：** Re-export from [react-use](https://github.com/streamich/react-use)

React 状态 Hook，用于跟踪对象的值。

## 示例

```tsx
import { useMap } from "@lynx-js/react-use";

const Demo = () => {
  const [map, { set, setAll, remove, reset }] = useMap({
    hello: "there",
  });

  return (
    <view>
      <view bindtap={() => set(String(Date.now()), new Date().toJSON())}>
        Add
      </view>
      <view bindtap={() => reset()}>Reset</button>
      <view bindtap={() => setAll({ hello: "new", data: "data" })}>
        Set new data
      </view>
      <view bindtap={() => remove("hello")} disabled={!map.hello}>
        Remove 'hello'
      </view>
      <text>{JSON.stringify(map, null, 2)}</text>
    </view>
  );
};
```

## 类型定义

```ts
interface StableActions<T extends object> {
  set: <K extends keyof T>(key: K, value: T[K]) => void;
  setAll: (newMap: T) => void;
  remove: <K extends keyof T>(key: K) => void;
  reset: () => void;
}
interface Actions<T extends object> extends StableActions<T> {
  get: <K extends keyof T>(key: K) => T[K];
}
declare const useMap: <T extends object = any>(
  initialMap?: T
) => [T, Actions<T>];
```