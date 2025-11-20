# useDefault

> **致谢：** Re-export from [react-use](https://github.com/streamich/react-use)

React 状态 Hook，当状态为 `null` 或 `undefined` 时返回默认值。

## 示例

```tsx
import { useDefault } from "@lynx-js/react-use";

const Demo = () => {
  const initialUser = { name: "Marshall" };
  const defaultUser = { name: "Mathers" };
  const [user, setUser] = useDefault(defaultUser, initialUser);

  return (
    <view>
      <text>User: {user.name}</text>
      <view bindtap={() => setUser(null)}>set to null</view>
    </view>
  );
};
```

## 类型定义

```ts
import { Dispatch, SetStateAction } from "react";

type SetState<T> = Dispatch<SetStateAction<T | null | undefined>>;

type UseDefaultReturn<T> = readonly [T, SetState<T>];

declare function useDefault<T>(
  defaultValue: T,
  initialValue: T | (() => T)
): UseDefaultReturn<T>;
```