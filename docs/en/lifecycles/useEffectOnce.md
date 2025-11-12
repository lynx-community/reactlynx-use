# useEffectOnce

> **Credit:** Re-export from [react-use](https://github.com/streamich/react-use)

React lifecycle hook that runs an effect only once.

## Usage

```tsx
import { useEffectOnce } from "@lynx-js/react-use";

const Demo = () => {
  useEffectOnce(() => {
    console.log("Running effect once on mount");

    return () => {
      console.log("Running clean-up of effect on unmount");
    };
  });

  return null;
};
```

## Type Declarations

```ts
import type { EffectCallback } from "@lynx-js/react";

declare const useEffectOnce: (effect: EffectCallback) => void;
```