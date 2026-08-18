# useComputedStyle

从主线程元素读取已解析的 CSS 计算属性值，并将其转发到后台（React）线程的 Hook。

## 问题

Lynx 的 `<svg>` 元素有一个 `current-color` 属性（`<image>` 有 `tint-color`），它接受纯色字符串，但**不支持 `var(--css-var)` 语法**，因为它是组件属性而非 CSS 属性。

这使得通过 CSS 自定义属性驱动 SVG 图标颜色变得困难——而这在使用 CSS 变量进行主题化的设计系统中是一种常见模式。

## 解决方案

`useComputedStyle` 弥补了这一差距：

1. 声明一个带 `var()` 值的标准 CSS 属性（如 `color: var(--theme-icon-color)`）
2. Hook 通过 `element.getComputedStyles()` 在主线程上读取**已解析的**值
3. 通过 `runOnBackground` 将已解析的值转发到后台线程
4. 在仅接受纯字符串的 JSX 属性中使用已解析的值

## 用法

```tsx
import { useComputedStyle } from "@lynx-js/react-use";

function MonochromeIcon({ src }: { src: string }) {
  const [ref, { color }] = useComputedStyle(["color"]);
  return (
    <view main-thread:ref={ref} className="icon">
      <svg src={src} current-color={color} />
    </view>
  );
}
```

```css
.icon {
  color: var(--theme-icon-color);
}
```

## 主题切换示例

```tsx
import { useState } from "@lynx-js/react";
import { useComputedStyle } from "@lynx-js/react-use";

function ThemedIcon({ src }: { src: string }) {
  const [dark, setDark] = useState(false);
  const [ref, { color }] = useComputedStyle(["color"]);

  return (
    <view className={dark ? "theme-dark" : "theme-light"}>
      <view main-thread:ref={ref} className="icon">
        <svg src={src} current-color={color} />
      </view>
      <view bindtap={() => setDark(!dark)}>
        <text>切换主题</text>
      </view>
    </view>
  );
}
```

```css
.theme-light {
  --theme-icon-color: #1a1a1a;
}
.theme-dark {
  --theme-icon-color: #ffffff;
}
.icon {
  color: var(--theme-icon-color);
}
```

## 读取多个属性

```tsx
const [ref, styles] = useComputedStyle(["color", "background-color", "opacity"]);
// styles.color, styles['background-color'], styles.opacity
```

## 限制

- `keys` 数组在 worklet 闭包创建时被捕获。如果需要更改读取的属性，组件必须重新挂载。
- 已解析的值是异步传递的（一次主线程 → 后台线程的往返），因此可能存在单帧 `styles` 为空 `{}` 的情况。

## 类型声明

```ts
import type { MainThread } from "@lynx-js/types";

type UseComputedStyleReturn = [
  ref: (element: MainThread.Element | null) => void,
  styles: Record<string, string>,
];

function useComputedStyle(keys: string[]): UseComputedStyleReturn;
```
