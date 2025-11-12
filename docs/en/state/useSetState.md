# useSetState

> **Credit:** Re-export from [react-use](https://github.com/streamich/react-use)

React state hook that creates `setState` method which works similar to how `this.setState` works in class components—it merges object changes into current state.

## Usage

```tsx
import { useSetState } from "@lynx-js/react-use";

const Demo = () => {
  const [state, setState] = useSetState({});

  return (
    <view>
      <view>{JSON.stringify(state, null, 2)}</view>
      <view bindtap={() => setState({ hello: "world" })}>hello</view>
      <view bindtap={() => setState({ foo: "bar" })}>foo</view>
      <view
        bindtap={() => {
          setState((prevState) => ({
            count: (prevState.count || 0) + 1,
          }));
        }}
      >
        count
      </view>
    </view>
  );
};
```

## Type Declarations

```ts
function useSetState<T extends object>(
  initialState?: T
): [
  state: T,
  setState: (patch: Partial<T> | ((prevState: T) => Partial<T>)) => void
];
```