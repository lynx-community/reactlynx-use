# useSetState

> **致谢：** Re-export from [react-use](https://github.com/streamich/react-use)

React 状态 Hook，创建一个 `setState` 方法，其工作方式类似于类组件中 `this.setState` 的工作方式——将对象更改合并到当前状态中。

## 示例

```tsx
import { useSetState } from "@lynx-js/react-use";

const Demo = () => {
  const [state, setState] = useSetState({});

  return (
    <view>
      <view>{JSON.stringify(state, null, 2)}</view>
      <view bindtap={() => setState({ hello: "world" })}>hello</view>
      <view bindtap={() => setState({ foo: "bar" })}>foo</view>
      <view
        bindtap={() => {
          setState((prevState) => ({
            count: (prevState.count || 0) + 1,
          }));
        }}
      >
        count
      </view>
    </view>
  );
};
```

## 类型定义

```ts
function useSetState<T extends object>(
  initialState?: T
): [
  state: T,
  setState: (patch: Partial<T> | ((prevState: T) => Partial<T>)) => void
];
```