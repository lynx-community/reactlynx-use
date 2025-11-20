# useCounter

> **致谢：** Re-export from [react-use](https://github.com/streamich/react-use)

 React 状态 Hook，用于跟踪数字值。

## 示例

```tsx
import { useCounter, useNumber } from "@lynx-js/react-use";

const Demo = () => {
  const [min, { inc: incMin, dec: decMin }] = useCounter(1);
  const [max, { inc: incMax, dec: decMax }] = useCounter(10);
  const [value, { inc, dec, set, reset }] = useCounter(5, max, min);

  return (
    <view>
      <view>
        <text>
          current: {value} [min: {min}; max: {max}]
        </text>
      </view>
      <view>
        <text>Current value: </text>
        <view bindtap={() => inc()}>Increment</view>
        <view bindtap={() => dec()}>Decrement</view>
        <view bindtap={() => inc(5)}>Increment (+5)</view>
        <view bindtap={() => dec(5)}>Decrement (-5)</view>
        <view bindtap={() => set(100)}>Set 100</view>
        <view bindtap={() => reset()}>Reset</view>
        <view bindtap={() => reset(25)}>Reset (25)</view>
      </view>
      <view>
        <text> Min value:</text>
        <view bindtap={() => incMin()}>Increment</view>
        <view bindtap={() => decMin()}>Decrement</view>
      </view>
      <view>
        <text> Max value:</text>
        <view bindtap={() => incMax()}>Increment</view>
        <view bindtap={() => decMax()}>Decrement</view>
      </view>
    </view>
  );
};
```

## 类型定义

```ts
declare function useCounter(
  initialValue?: IHookStateInitAction<number>,
  max?: number | null,
  min?: number | null
): [number, CounterActions];
```