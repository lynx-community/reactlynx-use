# usePrevious

> **致谢：** Re-export from [react-use](https://github.com/streamich/react-use)

React 状态 Hook，返回前一个状态，如 [React hooks FAQ](https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state) 中所述。

## 示例

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

## 类型定义

```ts
declare function usePrevious<T>(state: T): T | undefined;
```