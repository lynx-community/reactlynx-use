# useThrottle

> **致谢：** Re-export from [react-use](https://github.com/streamich/react-use)

React 节流 Hook。

## 示例

```tsx
import { useState } from "@lynx-js/react";
import { useThrottle } from "@lynx-js/react-use";

const Demo = ({ value }) => {
  const throttledValue = useThrottle(value);

  return (
    <view>
      <text>Value: {value}</text>
      <text>Throttled value: {throttledValue}</text>
    <view/>
    </view>
  );
};
```

## 类型定义

```ts
declare const useThrottle: <T>(value: T, ms?: number) => T;
```