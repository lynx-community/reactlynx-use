# useUniqueId

React 状态 Hook，用于生成唯一 ID。该 ID 在组件重渲染期间保持不变。

## 示例

```tsx
import { useUniqueId } from "@lynx-js/react-use";

const Demo = () => {
  const id = useUniqueId("prefix-");
  // id 类似于 "prefix-V1StGXR8_Z5jdHi6B-myT"
  return <view id={id}>Content</view>;
};
```

## 为什么选择 nanoid？

本 Hook 使用 [nanoid](https://github.com/ai/nanoid) 生成 ID。

> Nano ID 是一个用于生成随机 ID 的库。与 UUID 一样，它也有重复 ID 的概率。然而，这个概率非常小。
> 需要约 1490 亿年或 1,307,660T 个 ID，才会有 1% 的概率发生至少一次碰撞。

## 类型定义

```ts
declare const useUniqueId: (prefix?: string) => string;
```
