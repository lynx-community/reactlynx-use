# useUnmountPromise

A life-cycle hook that provides a higher order promise that does not resolve if component un-mounts.

## Usage

```tsx
import { useUnmountPromise } from "@lynx-js/react-use";

const Demo = () => {
  const mounted = useUnmountPromise();
  useEffect(async () => {
    await mounted(someFunction()); // Will not resolve if component un-mounts.
  });
};
```

## Type Declarations

```ts
type Race = <P extends Promise<any>, E = any>(
  promise: P,
  onError?: (error: E) => void
) => P;

declare const useUnmountPromise: () => Race;
```