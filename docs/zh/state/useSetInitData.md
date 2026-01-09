# useSetInitData

一个结合了 `@lynx-js/react` 中 `useInitData` 和 `useState` 的 Hook。它使用 `useInitData` 的返回值来初始化 state。

## 用法

```tsx
import { useSetInitData } from '@lynx-js/react-use';

const Demo = () => {
  const [data, setData] = useSetInitData();

  return (
    <view>
      <text>Data: {JSON.stringify(data)}</text>
      <text bindtap={() => setData({ ...data, count: (data?.count || 0) + 1 })}>
        Increment
      </text>
    </view>
  );
};
```

## 类型声明

```ts
import { Dispatch, SetStateAction } from 'react';
import { InitData } from '@lynx-js/react';

export function useSetInitData(): readonly [InitData, Dispatch<SetStateAction<InitData>>];
```


## 了解更多

- [useInitData](https://lynxjs.org/api/react/function.useinitdata#returns)
- [InitData Interface](https://lynxjs.org/api/react/Interface.InitData.html)

