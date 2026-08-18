# useComputedStyle

`useComputedStyle` reads resolved CSS property values from a main-thread element and returns them to the background (React) thread. It is useful when a native element prop needs a plain value but the source of that value is a CSS custom property.

## Requirements

- Lynx SDK 3.5 or newer is required for `element.getComputedStyleProperty()`. Set the app bundle's engine version to at least `3.5`.
- Dynamic custom properties supplied through an inline `style` object require `enableCSSInlineVariables: true`.
- Put the standard CSS property and `main-thread:ref` on the same element. This does not depend on CSS inheritance.

For example:

```ts title="lynx.config.ts"
import { pluginLynxConfig } from "@lynx-js/config-rsbuild-plugin";
import { pluginReactLynx } from "@lynx-js/react-rsbuild-plugin";
import { defineConfig } from "@lynx-js/rspeedy";

export default defineConfig({
  plugins: [
    pluginReactLynx({ engineVersion: "3.5" }),
    pluginLynxConfig({ enableCSSInlineVariables: true }),
  ],
});
```

## CSS custom property to SVG `current-color`

An SVG component prop cannot resolve `var(--theme-color)` itself. The complete bridge is:

1. ReactLynx changes `--theme-color` in the ref element's inline style.
2. The same element has `color: var(--theme-color)` in CSS.
3. `useComputedStyle` runs `element.getComputedStyleProperty("color")` on the main thread after the element update is committed.
4. The resolved string is returned to the background thread and passed to the SVG's `current-color` prop.
5. The unchanged SVG content resolves its own `fill="currentColor"` against that prop.

```tsx title="src/App.tsx"
import { useState } from "@lynx-js/react";
import { useComputedStyle } from "@lynx-js/react-use";
import "./App.css";

const ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="currentColor"/></svg>`;

const THEMES = [
  { name: "Blue", color: "#1a73e8" },
  { name: "Red", color: "#d93025" },
  { name: "Green", color: "#1e8e3e" },
  { name: "Orange", color: "#f29900" },
];

export function App() {
  const [themeIndex, setThemeIndex] = useState(0);
  const theme = THEMES[themeIndex];
  const [ref, styles] = useComputedStyle(["color"], [themeIndex]);

  return (
    <view>
      <view
        main-thread:ref={ref}
        className="icon-wrapper"
        style={{ "--theme-color": theme.color } as Record<string, string>}
      >
        <svg
          className="icon"
          content={ICON}
          current-color={styles.color}
          enable-serval-svg={true}
        />
      </view>

      <text>{`Computed color: ${styles.color ?? "(pending)"}`}</text>
      <view
        bindtap={() => setThemeIndex((themeIndex + 1) % THEMES.length)}
      >
        <text>Switch from {theme.name}</text>
      </view>
    </view>
  );
}
```

```css title="src/App.css"
.icon-wrapper {
  color: var(--theme-color);
  width: 120rpx;
  height: 120rpx;
}

.icon {
  width: 120rpx;
  height: 120rpx;
}
```

The tested Android SVG component only re-renders `current-color` updates through its Serval renderer, so the verified example sets `enable-serval-svg={true}`. This does not alter the SVG content string; its visible fill still comes from `fill="currentColor"`.

## API

```ts
import type { MainThreadRef } from "@lynx-js/react";
import type { MainThread } from "@lynx-js/types";

type UseComputedStyleReturn = [
  ref: MainThreadRef<MainThread.Element | null>,
  styles: Record<string, string>,
];

function useComputedStyle(
  keys: string[],
  deps?: unknown[],
): UseComputedStyleReturn;
```

`keys` contains CSS property names in kebab-case. Pass every value that can invalidate the result in `deps`; after one changes, the hook schedules a new main-thread read for a frame after the ReactLynx patch.

```tsx
const [ref, styles] = useComputedStyle(
  ["color", "background-color", "opacity"],
  [themeIndex],
);
// styles.color, styles["background-color"], styles.opacity
```

The result is asynchronous, so `styles` is initially `{}`. A re-read that produces the same key/value pairs preserves the existing object and does not trigger another render.

## Real-device verification

These screenshots were captured on a real Android device with Lynx SDK 4.1 and an app bundle targeting engine version 3.5. In every screenshot, the displayed value came from `getComputedStyleProperty("color")`, and the play-circle fill came from passing that exact value to SVG `current-color`. No parent inheritance, inline `color`, background-color proxy, or SVG string replacement is used.

| Blue — `rgb(26, 115, 232)` | Red — `rgb(217, 48, 37)` |
|---|---|
| ![Blue SVG fill and computed color](./assets/use-computed-style-blue.png) | ![Red SVG fill and computed color](./assets/use-computed-style-red.png) |

| Green — `rgb(30, 142, 62)` | Orange — `rgb(242, 153, 0)` |
|---|---|
| ![Green SVG fill and computed color](./assets/use-computed-style-green.png) | ![Orange SVG fill and computed color](./assets/use-computed-style-orange.png) |
