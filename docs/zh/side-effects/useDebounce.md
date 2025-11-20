# useDebounce

> **致谢：** Re-export from [react-use](https://github.com/streamich/react-use)

React Hook，延迟调用函数，直到自上次调用防抖函数后经过 wait 毫秒。

第三个参数是防抖依赖的值数组，使用方式与 `useEffect` 相同。当其中一个值发生变化时，防抖超时将重新开始计时。

## 示例

```tsx
import { useState } from "@lynx-js/react";
import { useDebounce } from "@lynx-js/react-use";

const Demo = () => {
  const [state, setState] = useState("Typing stopped");
  const [val, setVal] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  const [, cancel] = useDebounce(
    () => {
      setState("Typing stopped");
      setDebouncedValue(val);
    },
    2000,
    [val]
  );

  return (
    <view>
      <input
        type="text"
        placeholder="Debounced input"
        bindinput={({ value }) => {
          setState("Waiting for typing to stop...");
          setVal(value);
        }}
      />
      <view>{state}</view>
      <view>
        <text>Debounced value: {debouncedValue}</text>
        <view bindtap={cancel}>Cancel debounce</view>
      </view>
    </view>
  );
};
```

## 类型定义

```ts
type UseDebounceReturn = [() => boolean | null, () => void];

declare function useDebounce(
  fn: Function,
  ms?: number,
  deps?: DependencyList
): UseDebounceReturn;
```