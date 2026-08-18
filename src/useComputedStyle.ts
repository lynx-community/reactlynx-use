// Copyright 2025 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import { runOnBackground, useState } from '@lynx-js/react';
import type { MainThread } from '@lynx-js/types';

interface MainThreadElementWithComputedStyles extends MainThread.Element {
  getComputedStyles(keys: string[]): Record<string, string>;
}

export type UseComputedStyleReturn = [
  ref: (element: MainThread.Element | null) => void,
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
 * @returns A tuple of `[ref, styles]` where `ref` is a main-thread ref callback
 *   and `styles` is the resolved values keyed by property name.
 *
 * @example
 * ```tsx
 * // .icon { color: var(--theme-icon-color); }
 * const [ref, { color }] = useComputedStyle(['color']);
 * return (
 *   <view main-thread:ref={ref} className="icon">
 *     <svg src={iconSrc} current-color={color} />
 *   </view>
 * );
 * ```
 */
export default function useComputedStyle(keys: string[]): UseComputedStyleReturn {
  const [styles, setStyles] = useState<Record<string, string>>({});

  const sendToBackground = runOnBackground(
    (resolved: Record<string, string>) => {
      'background only';
      setStyles(resolved);
    },
  );

  const mtRef = (element: MainThread.Element | null) => {
    'main thread';
    if (!element) return;
    const el = element as MainThreadElementWithComputedStyles;
    if (typeof el.getComputedStyles !== 'function') return;
    const resolved = el.getComputedStyles(keys);
    sendToBackground(resolved);
  };

  return [mtRef, styles];
}
