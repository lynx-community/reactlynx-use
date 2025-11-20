# useToggle

> **致谢：** Re-export from [react-use](https://github.com/streamich/react-use)

React 状态 Hook，用于跟踪布尔值。

## 示例

```tsx
import { useToggle } from "@lynx-js/react-use";

const Demo = () => {
  const [on, toggle] = useToggle(true);

  return (
    <view>
      <view>{on ? "ON" : "OFF"}</view>
      <view bindtap={toggle}>Toggle</view>
      <view bindtap={() => toggle(true)}>set ON</view>
      <view bindtap={() => toggle(false)}>set OFF</view>
    </view>
  );
};
```

## 类型定义

```ts
declare function useToggle(
  initialValue: boolean
): [boolean, (nextValue?: any) => void];
```