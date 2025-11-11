# useNumber

React state hook that tracks a numeric value.

`useNumber` is an alias for `useCounter`.

> **Credit:** Re-export from [react-use](https://github.com/streamich/react-use)

## Usage

See [useCounter](./useCounter) for more details.

## Type Declarations

```ts
declare function useNumber(
  initialValue?: IHookStateInitAction<number>,
  max?: number | null,
  min?: number | null
): [number, CounterActions];
```