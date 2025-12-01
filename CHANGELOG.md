# @lynx-js/react-use

## 0.0.5

### Patch Changes

- 9803c0a: Use deep import paths for `react-use`.

## 0.0.4

### Patch Changes

- 90dce6d: Introduce exposure hooks:

  - `useExposureForNode`: Node-level exposure hook with optional admission gating.
  - `useExposureForPage`: Page-level exposure hook handling multiple items via `GlobalEventEmitter`.
  - `useStayTime`: Tracks element visibility duration with optional manual control.

## 0.0.3

### Patch Changes

- 8b884d7: Add `package.json#peerDependencies` & set `package.json#sideEffects` to `false`

## 0.0.2

### Patch Changes

- da2238e: Introduce `useVelocity`: a hook that tracks touch velocity and direction with smoothing support.
