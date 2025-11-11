# useBoolean

React state hook that tracks value of a boolean.

`useBoolean` is an alias for `useToggle`.

> **Credit:** Re-export from [react-use](https://github.com/streamich/react-use)

## Usage

See [useToggle](./useToggle) for more details.

## Type Declarations

```ts
declare function useBoolean(
  initialValue: boolean
): [boolean, (nextValue?: any) => void];
```