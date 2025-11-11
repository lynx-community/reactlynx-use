# useError

React side-effect hook that returns an error dispatcher.

> **Credit:** Re-export from [react-use](https://github.com/streamich/react-use)

## Usage

```tsx
import { useError } from "@lynx-js/react-use";

const Demo = () => {
  const dispatchError = useError();

  const tapHandler = () => {
    "background only";
    dispatchError(new Error("Some error!"));
  };

  return <view bindtap={tapHandler}>Click me to throw</view>;
};

// In parent app
const App = () => (
  <ErrorBoundary>
    <Demo />
  </ErrorBoundary>
);
```

## Type Declarations
```ts
declare const useError: () => (err: Error) => void;
```