# useDefault

React state hook that returns the default value when state is `null` or `undefined`.

> **Credit:** Re-export from [react-use](https://github.com/streamich/react-use)

## Usage

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

## Type Declarations

```ts
import { Dispatch, SetStateAction } from "react";

type SetState<T> = Dispatch<SetStateAction<T | null | undefined>>;

type UseDefaultReturn<T> = readonly [T, SetState<T>];

declare function useDefault<T>(
  defaultValue: T,
  initialValue: T | (() => T)
): UseDefaultReturn<T>;
```