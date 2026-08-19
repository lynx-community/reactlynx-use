---
"@lynx-js/react-use": minor
---

Add `useComputedStyle` for reading resolved CSS values from a main-thread element.

The hook fails open: a value it cannot resolve is reported as `undefined` rather than as an empty string, so element props that fall back to a CSS property when undeclared (such as SVG `current-color` falling back to CSS `color`) keep their native behaviour.
