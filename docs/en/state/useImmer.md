# useImmer

> **Credit:** Inspired by [use-immer](https://github.com/immerjs/use-immer/tree/master)

Manage complex nested state with ease using [immer](https://github.com/immerjs/immer). Think of `useImmer` as `useState` but supercharged: you can modify state directly (like `state.count++`) without worrying about immutability rules.

> Learn more about Immer: [https://github.com/immerjs/immer](https://github.com/immerjs/immer)

## Usage

`useImmer` works just like `useState`, but the updater function hands you a `draft` that you can modify freely.

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

When passing a value to the updater instead of a function, `useImmer` hook behaves the same as `useState` hook and updates the state with that value.

```tsx
const [age, setAge] = useImmer(20);

function birthDay(event) {
  setAge(age + 1);
  console.log(`Happy birthday #${age} Anon! hope you good`);
}
```

## Type Declarations

```ts
export type DraftFunction<S> = (draft: Draft<S>) => void;
export type Updater<S> = (arg: S | DraftFunction<S>) => void;
export type ImmerHook<S> = [S, Updater<S>];

export function useImmer<S>(initialValue: S | (() => S)): ImmerHook<S>;
```
