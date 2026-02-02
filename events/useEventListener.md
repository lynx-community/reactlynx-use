# useEventListener

A hook that helps you add a global event listener as early as possible.

## Usage

```tsx
import { useEventListener } from "@lynx-js/react-use";

const App = () => {
  // Listen to the 'exposure' event
  useEventListener("exposure", (e) => {
    console.log("exposure", e);
  });

  // Listen to the 'disexposure' event
  useEventListener("disexposure", (e) => {
    console.log("disexposure", e);
  });

  return (
    <view
      style={{ width: "100px", height: "100px", backgroundColor: "red" }}
      exposure-id="a"
    />
  );
};
```

## Type Declarations

```ts
declare const useEventListener: (
  eventName: string,
  listener: (...args: any[]) => void
) => void;
```
