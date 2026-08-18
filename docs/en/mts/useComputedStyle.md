# useComputedStyle

A Hook that reads resolved computed CSS property values from a main-thread element and forwards them to the background (React) thread.

## Problem

Lynx's `<svg>` element has a `current-color` prop (and `<image>` has `tint-color`) that accepts a plain color string, but **does not support `var(--css-var)` syntax** because it's a component prop, not a CSS property.

This makes it hard to drive SVG icon colors from CSS custom properties — a common pattern in design systems that use CSS variables for theming.

## Solution

`useComputedStyle` bridges the gap:

1. Declare a standard CSS property with a `var()` value (e.g. `color: var(--theme-icon-color)`)
2. The hook reads the **resolved** value on the main thread via `element.getComputedStyles()`
3. The resolved value is forwarded to the background thread via `runOnBackground`
4. Use the resolved value in JSX props that only accept plain strings

## Usage

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

## Theme Switching Example

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
        <text>Toggle Theme</text>
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

## Reading Multiple Properties

```tsx
const [ref, styles] = useComputedStyle(["color", "background-color", "opacity"]);
// styles.color, styles['background-color'], styles.opacity
```

## Limitations

- The `keys` array is captured by the worklet closure at creation time. If you need to change which properties are read, the component must remount.
- The resolved values are delivered asynchronously (one main-thread → background-thread round trip), so there may be a single frame where `styles` is empty `{}`.

## Type Declarations

```ts
import type { MainThread } from "@lynx-js/types";

type UseComputedStyleReturn = [
  ref: (element: MainThread.Element | null) => void,
  styles: Record<string, string>,
];

function useComputedStyle(keys: string[]): UseComputedStyleReturn;
```
