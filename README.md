<div align="center">
  <h1>
    <br/>
    <br/>
    🐈‍⬛
    <br />
    <br />
    <br />
    <br />
    <br />
  </h1>
  <sup>
    <br />
    <br />
    <a href="https://www.npmjs.com/package/@lynx-js/react-use">
       <img src="https://img.shields.io/npm/v/@lynx-js/react-use.svg" alt="npm package" />
    </a>
    <a href="https://www.npmjs.com/package/@lynx-js/react-use">
      <img src="https://img.shields.io/npm/dm/@lynx-js/react-use.svg" alt="npm downloads" />
    </a>
    <a href="./LICENSE">
      <img src="https://img.shields.io/badge/license-Apache%202.0-blue.svg" alt="license" />
    </a>
    <br />
    <br />
    A React-style hooks library designed specifically for <a href="https://lynxjs.org/react/">ReactLynx</a>.
    <br />
    Translations: <a href="https://github.com/lynx-community/reactlynx-use/blob/main/README.zh-CN.md">🇨🇳 汉语</a>
  </sup>
  <br />
  <br />
  <br />
  <br />
  <pre>npm i <a href="https://www.npmjs.com/package/@lynx-js/react-use">@lynx-js/react-use</a></pre>
  <br />
  <br />
  <br />
  <br />
  <br />
</div>

---
<div align="center">
  <h2>✨ Features</h2>
</div>

<br/>

- 🎯 **ReactLynx Compatible** &mdash; seamlessly integrates with ReactLynx applications
- ⚛️ **React-Style API** &mdash; familiar hooks interface for React developers
- 🔧 **Cross-Platform** &mdash; built with Lynx's unique cross-platform capabilities in mind

<br/>
<br/>

---

<div align="center">
  <h2>📄 Docs</h2>
</div>

- [**MainThreadScripts**](./docs/en/mts/README.md)
  - [`useMainThreadImperativeHandle`](./docs/en/mts/useMainThreadImperativeHandle.md) &mdash; main-thread version of React's [useImperativeHandle](https://react.dev/reference/react/useImperativeHandle).
  - [`usePointerEvent`](./docs/en/mts/usePointerEvent.md) &mdash; a Hook unifies [`TouchEvent`](https://lynxjs.org/api/lynx-api/event/touch-event.html) and [`MouseEvent`](https://lynxjs.org/api/lynx-api/event/mouse-event.html) into `PointerEvent`, to help with handling pointer events in a cross-platform manner.
  - [`useTapLock`](./docs/en/mts/useTapLock.md) &mdash; a hook for locking tap events.
  - [`useTouchEmulation`](./docs/en/mts/useTouchEmulation) &mdash; a Hook synthesizes [`TouchEvent`](https://lynxjs.org/api/lynx-api/event/touch-event.html) from [`MouseEvent`](https://lynxjs.org/api/lynx-api/event/mouse-event.html), so existing touch handlers can work seamlessly with mouse input. Useful for migration from touch-only code.
  - [`useVelocity`](./docs/en/mts/useVelocity.md) &mdash; a hook that tracks touch velocity and direction with smoothing support.
    <br/>
    <br/>
- [**Events**](./docs/en/events/README.md)
  - [`useEventListener`](./docs/en/events/useEventListener.md) &mdash; a hook that helps you add a global event listener as early as possible.
  - [`useExposureForNode`](./docs/en/events/useExposureForNode.md) &mdash; Node-level exposure hook with optional admission gating.
  - [`useExposureForPage`](./docs/en/events/useExposureForPage.md) &mdash; Page-level exposure hook that consumes `GlobalEventEmitter` events and manages multiple items with admission gating.
  - [`useStayTime`](./docs/en/events/useStayTime.md) &mdash; Track how long an element stays visible, with optional manual control.
    <br/>
    <br/>
- [**Lifecycles**](./docs/en/lifecycles/README.md)
  - [`useEffectOnce`](./docs/en/lifecycles/useEffectOnce.md) &mdash; a modified [`useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect) hook that only runs once.
  - [`useLifecycles`](./docs/en/lifecycles/useLifecycles.md) &mdash; calls `mount` and `unmount` callbacks.
  - [`useMountedState`](./docs/en/lifecycles/useMountedState.md) and [`useUnmountPromise`](./docs/en/lifecycles/useUnmountPromise.md) &mdash; track if component is mounted.
  - [`useUnmount`](./docs/en/lifecycles/useUnmount.md) &mdash; calls `unmount` callbacks.
  - [`useUpdateEffect`](./docs/en/lifecycles/useUpdateEffect.md) &mdash; run an `effect` only on updates.
    <br/>
    <br/>
- [**SideEffects**](./docs/en/side-effects/README.md)
  - [`useDebounce`](./docs/en/side-effects/useDebounce.md) &mdash; debounces a function.
  - [`useError`](./docs/en/side-effects/useError.md) &mdash; error dispatcher.
  - [`useThrottle` and `useThrottleFn`](./docs/en/side-effects/useThrottle.md) &mdash; throttles a function.
    <br/>
    <br/>
- [**State**](./docs/en/state/README.md)
  - [`createMemo`](./docs/en/state/createMemo.md) &mdash; factory of memoized hooks.
  - [`useToggle` and `useBoolean`](./docs/en/state/useToggle.md) &mdash; tracks state of a boolean.
  - [`useCounter` and `useNumber`](./docs/en/state/useCounter.md) &mdash; tracks state of a number.
  - [`useDefault`](./docs/en/state/useDefault.md) &mdash; returns the default value when state is `null` or `undefined`.
  - [`useImmer`](./docs/en/state/useImmer.md) &mdash; manage complex nested state with ease using [immer](https://github.com/immerjs/immer).
  - [`useLatest`](./docs/en/state/useLatest.md) &mdash; returns the latest state or props
  - [`useMap`](./docs/en/state/useMap.md) &mdash; tracks state of an object.
  - [`usePrevious`](./docs/en/state/usePrevious.md) &mdash; returns the previous state or props.
  - [`useQueue`](./docs/en/state/useQueue.md) &mdash; implements simple queue.
  - [`useSet`](./docs/en/state/useSet.md) &mdash; tracks state of a Set.
  - [`useSetState`](./docs/en/state/useSetState.md) &mdash; creates `setState` method which works like `this.setState`.
  - [`useUniqueId`](./docs/en/state/useUniqueId.md) &mdash; generates a unique ID.

<br />
<br />

---

<div align="center">
  <h2>🙏 Credits</h2>
</div>

<br />

Many hooks in this library are built upon the excellent foundation provided by [**react-use**](https://github.com/streamich/react-use). We extend our gratitude to the maintainers and contributors for their outstanding work in the React hooks ecosystem.

We also draw inspiration from other amazing projects:

- [kripod/react-hooks](https://github.com/kripod/react-hooks)
- [vueuse/vueuse](https://github.com/vueuse/vueuse)
- [alibaba/hooks](https://github.com/alibaba/hooks)

<br />
<br />

---

<p align="center">
  Made with ❤️ for the ReactLynx community
</p>
