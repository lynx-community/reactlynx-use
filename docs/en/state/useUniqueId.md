# useUniqueId

React hook that generates a unique ID. The ID is stable across re-renders.

## Usage

```tsx
import { useUniqueId } from "@lynx-js/react-use";

const Demo = () => {
  const id = useUniqueId("prefix-");
  // id will be something like "prefix-V1StGXR8_Z5jdHi6B-myT"
  return <view id={id}>Content</view>;
};
```

## Why nanoid?

This hook uses [nanoid](https://github.com/ai/nanoid) for ID generation.

> Nano ID is a library for generating random IDs. Likewise UUID, there is a probability of duplicate IDs. However, this probability is extremely small.
> ~149 billion years or 1,307,660T IDs needed, in order to have a 1% probability of at least one collision.

## Type Declarations

```ts
declare const useUniqueId: (prefix?: string) => string;
```
