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
    专为 <a href="https://lynxjs.org/react/">ReactLynx</a> 设计的 React 风格 hooks 库。
    <br />
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
  <h2>✨ 特性</h2>
</div>

<br/>

- 🎯 **ReactLynx 兼容** &mdash; 与 ReactLynx 应用无缝集成
- ⚛️ **React 风格 API** &mdash; 为 React 开发者提供熟悉的 hooks API
- 🔧 **跨平台特性** &mdash; 基于 Lynx 跨平台特性精心设计

<br/>
<br/>

---

<div align="center">
  <h2>📄 文档</h2>
</div>

- [**主线程脚本**](./docs/zh/mts/README.md)
  - [`useMainThreadImperativeHandle`](./docs/zh/mts/useMainThreadImperativeHandle.md) &mdash; React [useImperativeHandle](https://react.dev/reference/react/useImperativeHandle) 的主线程版本。
  - [`usePointerEvent`](./docs/usePointerEvent.md) &mdash; 用于将 [`TouchEvent`](https://lynxjs.org/api/lynx-api/event/touch-event.html) 与 [`MouseEvent`](https://lynxjs.org/api/lynx-api/event/mouse-event.html) 统一为 `PointerEvent` 的 hook，便于跨平台处理指针事件。
  - [`useTapLock`](./docs/zh/mts/useTapLock.md) &mdash; 用于锁定点击事件的 hook。
  - [`useTouchEmulation`](./docs/useTouchEmulation.md) &mdash; 用于从 [`MouseEvent`](https://lynxjs.org/api/lynx-api/event/mouse-event.html) 合成 [`TouchEvent`](https://lynxjs.org/api/lynx-api/event/touch-event.html) 的 hook，使现有基于触摸的事件处理逻辑可以无缝兼容鼠标输入，便于从仅触摸代码迁移。
  - [`useVelocity`](./docs/zh/mts/useVelocity.md) &mdash; 用于跟踪 tap 速度和方向的 hook。
    <br/>
    <br/>
- [**事件**](./docs/zh/events/README.md)
  - [`useEventListener`](./docs/zh/events/useEventListener.md) &mdash; 用于尽早添加全局事件监听器的 hook。
  - [`useExposureForNode`](./docs/zh/events/useExposureForNode.md) &mdash; 节点级曝光 hook，可选曝光准入等待。
  - [`useExposureForPage`](./docs/zh/events/useExposureForPage.md) &mdash; 页面级曝光 hook，监听 `GlobalEventEmitter` 的曝光/反曝光事件并支持准入等待。
  - [`useStayTime`](./docs/zh/events/useStayTime.md) &mdash; 用于统计元素可见时长的 hook，支持手动控制。
    <br/>
    <br/>
- [**生命周期**](./docs/zh/lifecycles/README.md)
  - [`useEffectOnce`](./docs/zh/lifecycles/useEffectOnce.md) &mdash; 仅运行一次的 [`useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect)。
  - [`useLifecycles`](./docs/zh/lifecycles/useLifecycles.md) &mdash; 调用 `mount` 和 `unmount` 回调。
  - [`useMountedState`](./docs/zh/lifecycles/useMountedState.md) 和 [`useUnmountPromise`](./docs/zh/lifecycles/useUnmountPromise.md) &mdash; 跟踪组件是否已挂载。
  - [`useUnmount`](./docs/zh/lifecycles/useUnmount.md) &mdash; 调用 `unmount` 回调。
  - [`useUpdateEffect`](./docs/zh/lifecycles/useUpdateEffect.md) &mdash; 仅在更新时运行 `effect`。
    <br/>
    <br/>
- [**副作用**](./docs/zh/side-effects/README.md)
  - [`useDebounce`](./docs/zh/side-effects/useDebounce.md) &mdash; 对函数进行防抖处理。
  - [`useError`](./docs/zh/side-effects/useError.md) &mdash; 错误分发器。
  - [`useThrottle` 和 `useThrottleFn`](./docs/zh/side-effects/useThrottle.md) &mdash; 对函数进行节流处理。
    <br/>
    <br/>
- [**状态**](./docs/zh/state/README.md)
  - [`createMemo`](./docs/zh/state/createMemo.md) &mdash; memoized hooks 的工厂函数。
  - [`useToggle` 和 `useBoolean`](./docs/zh/state/useToggle.md) &mdash; 跟踪布尔值的状态。
  - [`useCounter` 和 `useNumber`](./docs/zh/state/useCounter.md) &mdash; 跟踪数字的状态。
  - [`useDefault`](./docs/zh/state/useDefault.md) &mdash; 当状态为 `null` 或 `undefined` 时返回默认值。
  - [`useImmer`](./docs/zh/state/useImmer.md) &mdash; 使用 [immer](https://github.com/immerjs/immer) 轻松管理复杂的嵌套状态。
  - [`useLatest`](./docs/zh/state/useLatest.md) &mdash; 返回最新的 state 或 props
  - [`useMap`](./docs/zh/state/useMap.md) &mdash; 跟踪对象的状态。
  - [`usePrevious`](./docs/zh/state/usePrevious.md) &mdash; 返回之前的 state 或 props。
  - [`useQueue`](./docs/zh/state/useQueue.md) &mdash; 实现简单的队列。
  - [`useSet`](./docs/zh/state/useSet.md) &mdash; 跟踪 Set 的状态。
  - [`useSetInitData`](./docs/zh/state/useSetInitData.md) &mdash; 将 initData 暴露为可修改的状态。
  - [`useSetState`](./docs/zh/state/useSetState.md) &mdash; 创建类似 `this.setState` 工作方式的 `setState` 方法。
  - [`useUniqueId`](./docs/zh/state/useUniqueId.md) &mdash; 生成唯一 ID。

<br />
<br />

---

<div align="center">
  <h2>🙏 致谢</h2>
</div>

<br />

本库中的许多 hooks 都建立在 [**react-use**](https://github.com/streamich/react-use) 提供的优秀基础之上。我们向维护者和贡献者致以诚挚的谢意，感谢他们在 React hooks 生态系统中的杰出工作。

我们还从其他优秀项目中汲取灵感：

- [kripod/react-hooks](https://github.com/kripod/react-hooks)
- [vueuse/vueuse](https://github.com/vueuse/vueuse)
- [alibaba/hooks](https://github.com/alibaba/hooks)

<br />
<br />

---

<p align="center">
  用 ❤️ 为 ReactLynx 社区打造
</p>
