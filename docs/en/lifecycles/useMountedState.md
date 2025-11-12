# useMountedState

> **Credit:** Re-export from [react-use](https://github.com/streamich/react-use)

> **NOTE!:** despite having `State` in its name **_this hook does not cause component re-render_**.  
> This component designed to be used to avoid state updates on unmounted components.

Lifecycle hook providing ability to check component's mount state.  
Returns a function that will return `true` if component mounted and `false` otherwise.

## Usage

```tsx
import { useEffect } from "@lynx-js/react";
import { useMountedState } from "@lynx-js/react-use";

const Demo = () => {
  const isMounted = useMountedState();

  useEffect(() => {
    setTimeout(() => {
      if (isMounted()) {
        // ...
      } else {
        // ...
      }
    }, 1000);
  });
};
```

## Type Declarations

```ts
function useMountedState(): () => boolean;
```