# useDebounce

> **Credit:** Re-export from [react-use](https://github.com/streamich/react-use)

React hook that delays invoking a function until after wait milliseconds have elapsed since the last time the debounced function was invoked.

The third argument is the array of values that the debounce depends on, in the same manner as useEffect. The debounce timeout will start when one of the values changes.

## Usage

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

## Type Declarations

```ts
type UseDebounceReturn = [() => boolean | null, () => void];

declare function useDebounce(
  fn: Function,
  ms?: number,
  deps?: DependencyList
): UseDebounceReturn;
```