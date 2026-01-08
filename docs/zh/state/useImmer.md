# useImmer

> **致谢：** 灵感来源于 [use-immer](https://github.com/immerjs/use-immer/tree/master)

使用 [immer](https://github.com/immerjs/immer) 轻松管理复杂的嵌套状态。可以将 `useImmer` 看作是增强版的 `useState`：你可以直接修改状态（例如 `state.count++`），而无需担心不可变性规则。

> 了解更多关于 Immer 的信息: [https://github.com/immerjs/immer](https://github.com/immerjs/immer)

## 用法

`useImmer` 的用法与 `useState` 非常相似，但其更新函数会提供一个可供自由修改的 `draft` 对象。

```tsx
import { useImmer } from '@lynx-js/react-use';

const JediProfile = () => {
  const [jedi, updateJedi] = useImmer({
    alias: 'SkyWalker',
    stats: {
      age: 19,
      midichlorians: 20000,
    },
  });

  function updateAlias(alias) {
    updateJedi((draft) => {
      draft.alias = alias;
    });
  }

  function becomeYounger() {
    updateJedi((draft) => {
      draft.stats.age--;
    });
  }

  function train() {
    updateJedi((draft) => {
      draft.stats.midichlorians += 500;
    });
  }

  return (
    <view>
      <text>
        Name: {jedi.alias} (Age: {jedi.stats.age})
      </text>
      <text>Power Level: {jedi.stats.midichlorians}</text>

      <input
        bindinput={(e) => {
          updateAlias(e.detail.value);
        }}
        value={jedi.alias}
      />

      <view bindtap={becomeYounger}>Rejuvenate</view>
      <view bindtap={train}>Train Force</view>
    </view>
  );
};
```

当向更新函数传递一个值而不是函数时，`useImmer` hook 的行为与 `useState` hook 相同，并使用该值更新状态。

```tsx
const [age, setAge] = useImmer(20);

function birthDay(event) {
  setAge(age + 1);
  console.log(`Happy birthday #${age} Anon! hope you good`);
}
```

## 类型定义

```ts
export type DraftFunction<S> = (draft: Draft<S>) => void;
export type Updater<S> = (arg: S | DraftFunction<S>) => void;
export type ImmerHook<S> = [S, Updater<S>];

export function useImmer<S>(initialValue: S | (() => S)): ImmerHook<S>;
```
