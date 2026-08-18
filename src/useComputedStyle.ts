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

export type UseComputedStyleReturn = [
  ref: MainThreadRef<MainThread.Element | null>,
  styles: Record<string, string>,
];

/**
 * Reads resolved computed CSS property values from a main-thread element.
 *
 * CSS `var()` references are resolved in the styling pipeline, but some element
 * props (e.g. `current-color` on `<svg>`, `tint-color` on `<image>`) cannot
 * accept `var(...)` directly. This hook bridges the gap: declare a standard CSS
 * property with a `var()` value, read the resolved value on the main thread,
 * and forward it to the background (React) thread for use in JSX.
 *
 * @param keys - CSS property names in kebab-case to read.
 * @param deps - Values that should cause the computed styles to be read again.
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
export default function useComputedStyle(
  keys: string[],
  deps: unknown[] = [],
): UseComputedStyleReturn {
  const [styles, setStyles] = useState<Record<string, string>>({});
  const elementRef = useMainThreadRef<MainThread.Element | null>(null);

  useEffect(() => {
    let cancelled = false;

    function updateStyles(resolved: Record<string, string>) {
      'background only';
      if (cancelled) {
        return;
      }

      setStyles(previous => {
        const previousKeys = Object.keys(previous);
        const resolvedKeys = Object.keys(resolved);
        if (
          previousKeys.length === resolvedKeys.length
          && resolvedKeys.every(key => previous[key] === resolved[key])
        ) {
          return previous;
        }
        return resolved;
      });
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
        if (
          !element
          || typeof element.getComputedStyleProperty !== 'function'
        ) {
          return;
        }

        const resolved: Record<string, string> = {};
        for (const key of styleKeys) {
          resolved[key] = element.getComputedStyleProperty(key);
        }
        void runOnBackground(updateStyles)(resolved);
      });
    }

    void runOnMainThread(scheduleComputedStyleRead)(keys);

    return () => {
      cancelled = true;
    };
  }, deps);

  return [elementRef, styles];
}
