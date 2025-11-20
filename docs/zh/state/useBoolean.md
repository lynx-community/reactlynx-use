# useBoolean

> **致谢：** Re-export from [react-use](https://github.com/streamich/react-use)

React 状态 Hook，用于跟踪布尔值。

`useBoolean` 是 `useToggle` 的别名。

## 示例

See [useToggle](./useToggle) for more details.

## 类型定义

```ts
declare function useBoolean(
  initialValue: boolean
): [boolean, (nextValue?: any) => void];
```