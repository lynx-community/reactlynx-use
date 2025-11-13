# 🪝 ReactLynxUse

A React-style hooks library designed specifically for [ReactLynx](https://lynxjs.org/react/), bringing familiar React patterns to cross-platform applications.

## ✨ Features

- 🎯 **ReactLynx Compatible**: Seamlessly integrates with ReactLynx applications
- ⚛️ **React-Style API**: Familiar hooks interface for React developers
- 🔧 **Cross-Platform**: Built with Lynx's unique cross-platform capabilities in mind

## 🙏 Thanks

Many hooks in this library are built upon the excellent foundation provided by [react-use](https://github.com/streamich/react-use). We extend our gratitude to the maintainers and contributors of react-use for their outstanding work in the React hooks ecosystem.

We also draw inspiration from other amazing projects in the community:

- [kripod/react-hooks](https://github.com/kripod/react-hooks)
- [vueuse/vueuse](https://github.com/vueuse/vueuse)
- [alibaba/hooks](https://github.com/alibaba/hooks)

## Docs

- [**MainThreadScripts**](./docs/en/mts/README.md)
  - [`useMainThreadImperativeHandle`](./docs/en/mts/useMainThreadImperativeHandle.md)
  - [`useTapLock`](./docs/en/mts/useTapLock.md)
- [**Lifecycles**](./docs/en/lifecycles/README.md)
  - [`useEffectOnce`](./docs/en/lifecycles/useEffectOnce.md) &mdash; a modified [`useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect) hook that only runs once.
  - [`useLifecycles`](./docs/en/lifecycles/useLifecycles.md) &mdash; calls `mount` and `unmount` callbacks.
  - [`useMountedState`](./docs/en/lifecycles/useMountedState.md) and [`useUnmountPromise`](./docs/en/lifecycles/useUnmountPromise.md) &mdash; track if component is mounted.
  - [`useUnmount`](./docs/en/lifecycles/useUnmount.md) &mdash; calls `unmount` callbacks.
  - [`useUpdateEffect`](./docs/en/lifecycles/useUpdateEffect.md) &mdash; run an `effect` only on updates.
- [**SideEffects**](./docs/en/side-effects/README.md)
  - [`useDebounce`](./docs/en/side-effects/useDebounce.md) &mdash; debounces a function.
  - [`useError`](./docs/en/side-effects/useError.md) &mdash; error dispatcher. 
  - [`useThrottle` and `useThrottleFn`](./docs/en/side-effects/useThrottle.md) &mdash; throttles a function.
- [**State**](./docs/en/state/README.md)
  - [`createMemo`](./docs/en/state/createMemo.md) &mdash; factory of memoized hooks.
  - [`useToggle` and `useBoolean`](./docs/en/state/useToggle.md) &mdash; tracks state of a boolean.
  - [`useCounter` and `useNumber`](./docs/en/state/useCounter.md) &mdash; tracks state of a number. 
  - [`useDefault`](./docs/en/state/useDefault.md) &mdash; returns the default value when state is `null` or `undefined`.
  - [`useLatest`](./docs/en/state/useLatest.md) &mdash; returns the latest state or props
  - [`useMap`](./docs/en/state/useMap.md) &mdash; tracks state of an object.
  - [`usePrevious`](./docs/en/state/usePrevious.md) &mdash; returns the previous state or props. 
  - [`useQueue`](./docs/en/state/useQueue.md) &mdash; implements simple queue.
  - [`useSet`](./docs/en/state/useSet.md) &mdash; tracks state of a Set.
  - [`useSetState`](./docs/en/state/useSetState.md) &mdash; creates `setState` method which works like `this.setState`.

## ⚠️ Development Status

**This library is currently in early development stage and is NOT production ready.**

## 🤝 Contributing

As this project is in early development, we welcome contributions and feedback! Please feel free to:

- Report issues
- Suggest new hooks
- Submit pull requests
- Share your use cases

---

**Note**: This library is specifically designed for ReactLynx applications.
