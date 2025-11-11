# usePrevious

React state hook that returns the previous state as described in the [React hooks FAQ](https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state).

> **Credit:** Re-export from [react-use](https://github.com/streamich/react-use)

## Usage

```jsx
import { usePrevious } from "@lynx-js/react-use";

const Demo = () => {
  const [count, setCount] = React.useState(0);
  const prevCount = usePrevious(count);

  return (
    <view>
      <view bindtap={() => setCount(count + 1)}>+</view>
      <view bindtap={() => setCount(count - 1)}>-</view>
      <text>
        Now: {count}, before: {prevCount}
      </text>
    </view>
  );
};
```

## Type Declarations

```ts
declare function usePrevious<T>(state: T): T | undefined;
```