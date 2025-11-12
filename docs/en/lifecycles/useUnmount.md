# useUnmount

> **Credit:** Re-export from [react-use](https://github.com/streamich/react-use)

React lifecycle hook that calls a function when the component will unmount. Use `useLifecycles` if you need both a mount and unmount function.

## Usage

```tsx
import { useUnmount } from "@lynx-js/react-use";

const Demo = () => {
  useUnmount(() => {
    console.log("UNMOUNTED");
  });
  return null;
};
```

## Type Declarations

```ts
declare const useUnmount: (fn: () => any) => void;
```
