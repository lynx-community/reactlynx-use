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

- [**Lifecycles**](./docs/en/lifecycle/index.md)
  - [`useEffectOnce`](./docs/en/lifecycle/useEffectOnce.md) &mdash; a modified [`useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect) hook that only runs once.
  - [`useLifecycles`](./docs/en/lifecycle/useLifecycles.md) &mdash; calls `mount` and `unmount` callbacks.
  - [`useMountedState`](./docs/en/lifecycle/useMountedState.md) and [`useUnmountPromise`](./docs/en/lifecycle/useUnmountPromise.md) &mdash; track if component is mounted.
  - [`useUnmount`](./docs/en/lifecycle/useUnmount.md) &mdash; calls `unmount` callbacks.
  - [`useUpdateEffect`](./docs/en/lifecycle/useUpdateEffect.md) &mdash; run an `effect` only on updates.
  


## ⚠️ Development Status

**This library is currently in early development stage and is NOT production ready.**

## 📋 TODOs

### Lynx Cross-Platform Specific Hooks

- [x] **`useEventListener`**
- [x] **`useTapLock`**
- [ ] **`useTapAway`**
- [ ] **`useIntersection`**
- [ ] **`useInput`**
- [ ] **`useEvent`**

## 🚧 Coming Soon

- 📚 Comprehensive documentation
- 🧪 Unit tests and examples
- 📱 Platform-specific optimizations
- 🔄 Stable API design

## 🤝 Contributing

As this project is in early development, we welcome contributions and feedback! Please feel free to:

- Report issues
- Suggest new hooks
- Submit pull requests
- Share your use cases

---

**Note**: This library is specifically designed for ReactLynx applications.
