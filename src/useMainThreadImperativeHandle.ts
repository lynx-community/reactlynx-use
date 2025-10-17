import type { MainThreadRef, Ref } from '@lynx-js/react';
import { runOnMainThread, useEffect } from '@lynx-js/react';

/**
 * Main Thread Version of `useImperativeHandle`, can be used to trigger Component's main thread method.
 * @example
 * ```
function InternalComp({ 'main-thread:ref': MTRef }: { 'main-thread:ref'?: MainThreadRef<InternalCompMTRef | null> }) {
  function start() {
    'main thread'
    console.log('MT Start')
  }
  useMainThreadImperativeHandle(
    MTRef,
    () => {
      'main thread'
      return {
        start: start,
      }
    },
    [],
  )
  return (
    <view>
      <text>Internal Comp</text>
    </view>
  )
}
function App() {
  const internalMTRef = useMainThreadRef<InternalCompMTRef>(null);

  return (
    <view>
      <InternalComp main-thread:ref={internalMTRef}></InternalComp>
      <view
        main-thread:bindtap={() => {
          'main thread'
          internalMTRef.current?.start()
        }}
      >
        <text>Click to Trigger</text>
      </view>
    </view>
  )
}
 * ```
 */
export default function useMainThreadImperativeHandle<T, R extends T>(
  ref: MainThreadRef<T> | undefined,
  createHandle: () => R,
  deps: readonly unknown[],
): void {
  function setMTRef(instance: Ref<T> | undefined) {
    'main thread';
    if (typeof instance === 'function') {
      instance(createHandle());
    } else if (instance) {
      // @ts-expect-error Expected
      instance.current = createHandle();
    }
  }
  function unMTRef(instance: Ref<T> | undefined) {
    'main thread';
    if (typeof instance === 'function') {
      instance(null);
    } else if (instance) {
      // @ts-expect-error Expected
      instance.current = null;
    }
  }
  useEffect(
    () => {
      runOnMainThread(setMTRef)(ref);
      return () => {
        runOnMainThread(unMTRef)(ref);
      };
    },
    deps == null ? deps : deps.concat(ref),
  );
}
