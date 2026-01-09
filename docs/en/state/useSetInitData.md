# useSetInitData

A hook that combines `useInitData` and `useState` from `@lynx-js/react`. It initializes the state with the value from `useInitData`.

## Usage

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

## Type Declarations

```ts
import { Dispatch, SetStateAction } from 'react';
import { InitData } from '@lynx-js/react';

export function useSetInitData(): readonly [InitData, Dispatch<SetStateAction<InitData>>];
```


## Learn More

- [useInitData](https://lynxjs.org/api/react/function.useinitdata#returns)
- [InitData Interface](https://lynxjs.org/api/react/Interface.InitData.html)

