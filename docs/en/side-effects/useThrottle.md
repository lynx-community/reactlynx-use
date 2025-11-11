# useThrottle

React hooks that throttle.

> **Credit:** Re-export from [react-use](https://github.com/streamich/react-use)

## Usage

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

## Type Declarations

```ts
declare const useThrottle: <T>(value: T, ms?: number) => T;
```