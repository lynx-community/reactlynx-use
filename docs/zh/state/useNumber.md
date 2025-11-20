# useNumber

> **致谢：** Re-export from [react-use](https://github.com/streamich/react-use)

React 状态 Hook，用于跟踪数字值。

`useNumber` 是 `useCounter` 的别名。

## 示例

See [useCounter](./useCounter) for more details.

## 类型定义

```ts
declare function useNumber(
  initialValue?: IHookStateInitAction<number>,
  max?: number | null,
  min?: number | null
): [number, CounterActions];
```