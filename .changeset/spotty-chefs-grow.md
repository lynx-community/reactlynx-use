---
"@lynx-js/react-use": patch
---

Introduce exposure hooks:

- `useExposureForNode`: Node-level exposure hook with optional admission gating.
- `useExposureForPage`: Page-level exposure hook handling multiple items via `GlobalEventEmitter`.
- `useStayTime`: Tracks element visibility duration with optional manual control.
