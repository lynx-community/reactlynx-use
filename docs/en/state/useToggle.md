# useToggle

> **Credit:** Re-export from [react-use](https://github.com/streamich/react-use)

React state hook that tracks value of a boolean.

## Usage

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

## Type Declarations

```ts
declare function useToggle(
  initialValue: boolean
): [boolean, (nextValue?: any) => void];
```