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

## Full Working Example: CSS Vars → SVG Color Polyfill

This example demonstrates a complete theme-switching UI where CSS custom properties drive SVG icon colors via `useComputedStyle`.

```tsx
// src/App.tsx
import { useCallback, useState } from "@lynx-js/react";
import { useComputedStyle } from "@lynx-js/react-use";
import "./App.css";

const PLAY_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="currentColor"/></svg>`;

const THEMES = [
  { name: "Blue", color: "#1a73e8" },
  { name: "Red", color: "#d93025" },
  { name: "Green", color: "#1e8e3e" },
  { name: "Orange", color: "#f29900" },
];

function ThemedIcon() {
  const [ref, styles] = useComputedStyle(["color"]);
  const currentColor = styles["color"] || "#1a73e8";

  return (
    <view className="icon-wrapper" main-thread:ref={ref}>
      <svg content={PLAY_ICON_SVG} current-color={currentColor} />
    </view>
  );
}

export function App() {
  const [themeIndex, setThemeIndex] = useState(0);
  const theme = THEMES[themeIndex];

  const switchTheme = useCallback((i: number) => {
    "background only";
    setThemeIndex(i);
  }, []);

  return (
    <view className="container">
      <text className="title">useComputedStyle + SVG</text>
      <text className="subtitle">CSS vars → SVG current-color polyfill</text>

      {/* CSS `color` on this container drives the SVG fill via the hook */}
      <view className="icon-container" style={{ color: theme.color }}>
        <ThemedIcon />
      </view>

      <text className="theme-label" style={{ color: theme.color }}>
        {theme.name} Theme
      </text>

      <view className="button-row">
        {THEMES.map((t, i) => (
          <view
            key={t.name}
            bindtap={() => switchTheme(i)}
            className="theme-btn"
            style={{
              backgroundColor: i === themeIndex ? t.color : "#ffffff",
              borderColor: t.color,
            }}
          >
            <text
              className="theme-btn-text"
              style={{ color: i === themeIndex ? "#ffffff" : t.color }}
            >
              {t.name}
            </text>
          </view>
        ))}
      </view>
    </view>
  );
}
```

```css
/* src/App.css */
.container {
  width: 100vw;
  min-height: 100vh;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80rpx;
}

.icon-container {
  color: var(--theme-color);
  width: 200rpx;
  height: 200rpx;
  border-radius: 100rpx;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 60rpx;
}

.icon-wrapper {
  width: 120rpx;
  height: 120rpx;
}
```

### How It Works

1. The parent `<view className="icon-container">` sets `color` via inline style (which could also be `color: var(--theme-color)` in CSS).
2. `useComputedStyle(['color'])` reads the resolved `color` value from the main thread element.
3. The resolved color string is forwarded to the background thread via `runOnBackground`.
4. The `<svg>` element receives the color through its `current-color` prop — bypassing the limitation that props can't use `var()` directly.

## Type Declarations

```ts
import type { MainThread } from "@lynx-js/types";

type UseComputedStyleReturn = [
  ref: (element: MainThread.Element | null) => void,
  styles: Record<string, string>,
];

function useComputedStyle(keys: string[]): UseComputedStyleReturn;
```
