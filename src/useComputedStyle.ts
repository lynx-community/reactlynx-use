// Copyright 2025 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import type { MainThreadRef } from '@lynx-js/react';
import {
  runOnBackground,
  runOnMainThread,
  useEffect,
  useMainThreadRef,
  useState,
} from '@lynx-js/react';
import type { MainThread } from '@lynx-js/types';

interface MainThreadElementWithComputedStyleProperty
  extends MainThread.Element {
  getComputedStyleProperty(key: string): string;
}

/**
 * Resolved computed styles keyed by the requested CSS property names.
 *
 * A key is present only while its value is known. Anything that could not be
 * resolved - a pending first read, or a runtime or engine that cannot report
 * the property - is reported as `undefined` rather than as an empty string, so
 * a consumer can tell "no value" from "the empty value".
 */
export type ComputedStyles<Key extends string = string> = Readonly<
  Partial<Record<Key, string>>
>;

export type UseComputedStyleReturn<Key extends string = string> = [
  ref: MainThreadRef<MainThread.Element | null>,
  styles: ComputedStyles<Key>,
];

function hasSameEntries(
  previous: Readonly<Record<string, string | undefined>>,
  next: Readonly<Record<string, string | undefined>>,
): boolean {
  const previousKeys = Object.keys(previous);
  const nextKeys = Object.keys(next);
  return previousKeys.length === nextKeys.length
    && nextKeys.every(key => previous[key] === next[key]);
}

/**
 * Reads resolved computed CSS property values from a main-thread element.
 *
 * CSS `var()` references are resolved in the styling pipeline, but some element
 * props (e.g. `current-color` on `<svg>`, `tint-color` on `<image>`) cannot
 * accept `var(...)` directly. This hook bridges the gap: declare a standard CSS
 * property with a `var()` value, read the resolved value on the main thread,
 * and forward it to the background (React) thread for use in JSX.
 *
 * The hook fails open. When a value cannot be resolved its key is absent from
 * `styles`, so `styles[key]` is `undefined` and the consuming prop keeps
 * whatever behaviour it has without an explicit value. Element props that fall
 * back to a CSS property when they are not declared - SVG `current-color`
 * falls back to CSS `color` on newer Lynx SDKs - are therefore left intact
 * rather than suppressed by an explicit empty value.
 *
 * @param keys - CSS property names in kebab-case to read. Names are passed to
 *   the engine verbatim, so properties the engine learns to report later become
 *   readable without an API change.
 * @param deps - Values that should cause the computed styles to be read again.
 *   This is an invalidation hint, not a contract: a future runtime that can
 *   observe style changes on its own may re-read more often than `deps` asks.
 * @returns A tuple of `[ref, styles]` where `ref` is a main-thread ref and
 *   `styles` is the resolved values keyed by property name.
 *
 * @example
 * ```tsx
 * // .icon { color: var(--theme-color); }
 * const [ref, { color }] = useComputedStyle(['color'], [themeIndex]);
 * return (
 *   <view
 *     main-thread:ref={ref}
 *     className="icon"
 *     style={{ '--theme-color': theme.color }}
 *   >
 *     <svg content={icon} current-color={color} />
 *   </view>
 * );
 * ```
 */
export default function useComputedStyle<Key extends string>(
  keys: readonly Key[],
  deps: readonly unknown[] = [],
): UseComputedStyleReturn<Key> {
  const [styles, setStyles] = useState<Readonly<Record<string, string>>>({});
  const elementRef = useMainThreadRef<MainThread.Element | null>(null);

  useEffect(() => {
    let cancelled = false;

    function updateStyles(resolved: Record<string, string>) {
      'background only';
      if (cancelled) {
        return;
      }

      setStyles(previous =>
        hasSameEntries(previous, resolved) ? previous : resolved
      );
    }

    function scheduleComputedStyleRead(styleKeys: string[]) {
      'main thread';
      // Effects run on the background thread, and a runOnMainThread call made
      // by an effect can be bundled with the same patch that changed styles.
      // ReactLynx runs those bundled calls before flushing the element tree.
      // An MTS animation-frame callback runs after that flush, when computed
      // styles reflect the committed patch.
      requestAnimationFrame(() => {
        const element = elementRef.current as
          | MainThreadElementWithComputedStyleProperty
          | null;
        if (!element) {
          return;
        }

        if (typeof element.getComputedStyleProperty !== 'function') {
          // Older @lynx-js/react runtimes do not expose the reader at all.
          console.warn(
            '[useComputedStyle] element.getComputedStyleProperty() is '
              + 'unavailable; it requires @lynx-js/react >= 0.115.4. '
              + 'Computed styles stay unresolved.',
          );
          return;
        }

        const resolved: Record<string, string> = {};
        for (const key of styleKeys) {
          let value: string;
          try {
            value = element.getComputedStyleProperty(key);
          } catch (error) {
            // getComputedStyleProperty() throws below Lynx SDK 3.5. Never let
            // that escape into an engine animation frame, and never report a
            // value the engine did not give us.
            console.warn(
              `[useComputedStyle] cannot read "${key}": ${String(error)}`,
            );
            continue;
          }

          // The engine returns an empty string for a property it cannot report.
          // Dropping the key keeps `styles[key]` undefined so consumers stay on
          // their own fallback instead of receiving a value known to be wrong.
          if (value) {
            resolved[key] = value;
          }
        }

        void runOnBackground(updateStyles)(resolved);
      });
    }

    void runOnMainThread(scheduleComputedStyleRead)([...keys]);

    return () => {
      cancelled = true;
    };
    // `keys` is read inside the effect, so a changed key list must re-read even
    // when the caller's own `deps` did not change.
  }, [...deps, keys.join(' ')]);

  return [elementRef, styles as ComputedStyles<Key>];
}
