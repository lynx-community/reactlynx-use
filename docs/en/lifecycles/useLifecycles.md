# useLifecycles

> **Credit:** Re-export from [react-use](https://github.com/streamich/react-use)

React lifecycle hook that call `mount` and `unmount` callbacks, when component is mounted and un-mounted, respectively.

## Usage

```tsx
import { useLifecycles } from "@lynx-js/react-use";

const Demo = () => {
  useLifecycles(
    () => console.log("MOUNTED"),
    () => console.log("UNMOUNTED")
  );
  return null;
};
```

## Type Declarations

```ts
declare const useLifecycles: (mount: any, unmount?: any) => void;
```