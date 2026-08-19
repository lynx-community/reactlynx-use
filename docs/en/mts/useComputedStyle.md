# useComputedStyle

`useComputedStyle` reads resolved CSS property values from a main-thread element and returns them to the background (React) thread. It is useful when a native element prop needs a plain value but the source of that value is a CSS custom property.

## Requirements

- Lynx SDK 3.5 or newer is required for `element.getComputedStyleProperty()`, and `@lynx-js/react` 0.115.4 or newer is required for the reader itself. Set the app bundle's engine version to at least `3.5`. Below either version the hook resolves nothing instead of failing — see [Unresolved values](#unresolved-values).
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

type ComputedStyles<Key extends string = string> = Readonly<
  Partial<Record<Key, string>>
>;

type UseComputedStyleReturn<Key extends string = string> = [
  ref: MainThreadRef<MainThread.Element | null>,
  styles: ComputedStyles<Key>,
];

function useComputedStyle<Key extends string>(
  keys: readonly Key[],
  deps?: readonly unknown[],
): UseComputedStyleReturn<Key>;
```

`keys` contains CSS property names in kebab-case, and the key literals flow into the result type:

```tsx
const [ref, styles] = useComputedStyle(
  ["color", "background-color"],
  [themeIndex],
);
styles.color; // string | undefined
styles["background-color"]; // string | undefined
styles.opacity; // type error: not requested
```

Pass every value that can invalidate the result in `deps`; after one changes, the hook schedules a new main-thread read for a frame after the ReactLynx patch. Changing `keys` re-reads as well. A re-read that produces the same entries preserves the existing object and does not trigger another render.

## Unresolved values

`styles[key]` is `string | undefined`. It is `undefined` — never `""` — whenever the value is not known:

- the first read has not completed yet;
- `@lynx-js/react` is older than 0.115.4, so `getComputedStyleProperty()` does not exist;
- the Lynx SDK is older than 3.5, so `getComputedStyleProperty()` throws;
- the engine has no getter for the property and returns an empty string.

None of these throw on the main thread. The hook warns and leaves the key out.

This distinction matters because element props tell *absent* apart from *empty*. On newer Lynx SDKs an `<svg>` with no `current-color` prop falls back to its CSS `color`, while an explicitly empty `current-color` suppresses that fallback. Handing a consumer `""` would turn a working native fallback into an uncolored icon; handing it `undefined` leaves the native path in charge.

```tsx
// `styles.color` is undefined until it resolves, so `current-color` is absent
// and the platform's own CSS-color fallback applies in the meantime.
<svg content={icon} current-color={styles.color} />
```

## Forward compatibility

The hook is designed so that platform progress improves it without an API change.

1. **Fail open.** An unknown value is absent, never empty, so a native fallback is never suppressed. Once an element resolves the CSS property natively, the same source keeps working and this hook degrades into an optimization instead of a requirement.
2. **Keys pass through verbatim.** Property names reach the engine unchanged. CSS custom properties are not readable yet, but when the engine supports them, `useComputedStyle(["--theme-color"])` starts working with no change here.
3. **`deps` is a hint, not a contract.** Manual invalidation exists only because the runtime cannot observe style changes today. A runtime that can observe them may re-read more often, and code that passes `deps` stays correct either way.

## Known engine limitations

- CSS custom properties (`--*`) cannot be read through `getComputedStyleProperty()`. Read the standard property that consumes them — `color: var(--theme-color)` — instead. Tracked in [lynx-family/lynx#8682](https://github.com/lynx-family/lynx/issues/8682).
- Some registered properties return an empty string because the engine exposes no getter for them, including `display`, `position`, `overflow`, `visibility`, `box-sizing`, `white-space`, `flex-direction`, `background-repeat` and `mask-repeat`. Tracked in [lynx-family/lynx#8692](https://github.com/lynx-family/lynx/issues/8692).

## Real-device verification

These screenshots were captured on a real Android device with Lynx SDK 4.1 and an app bundle targeting engine version 3.5. In every screenshot, the displayed value came from `getComputedStyleProperty("color")`, and the play-circle fill came from passing that exact value to SVG `current-color`. No parent inheritance, inline `color`, background-color proxy, or SVG string replacement is used.

| Blue — `rgb(26, 115, 232)` | Red — `rgb(217, 48, 37)` |
|---|---|
| ![Blue SVG fill and computed color](./assets/use-computed-style-blue.png) | ![Red SVG fill and computed color](./assets/use-computed-style-red.png) |

| Green — `rgb(30, 142, 62)` | Orange — `rgb(242, 153, 0)` |
|---|---|
| ![Green SVG fill and computed color](./assets/use-computed-style-green.png) | ![Orange SVG fill and computed color](./assets/use-computed-style-orange.png) |
