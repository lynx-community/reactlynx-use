// biome-ignore-all lint/suspicious/noExplicitAny: need any here

import type { MainThreadRef } from '@lynx-js/react';
import { renderHook, waitFor } from '@lynx-js/react/testing-library';
import useMainThreadImperativeHandle from '../src/useMainThreadImperativeHandle';

describe('useMainThreadImperativeHandle', () => {
  it('function ref', () => {
    const refCallback = vi.fn();
    const handle = { start: vi.fn() };
    const createHandle = vi.fn(() => handle);

    const { unmount } = renderHook(() =>
      useMainThreadImperativeHandle(
        refCallback as any,
        createHandle,
        [],
      )
    );

    waitFor(() => {
      expect(createHandle).toHaveBeenCalled();
      expect(refCallback).toHaveBeenCalledWith(handle);
    });

    unmount();

    waitFor(() => {
      expect(refCallback).toHaveBeenCalledWith(null);
    });
  });

  it('object ref', () => {
    const ref: MainThreadRef<{ start: () => void }> = {
      current: { start: vi.fn() },
    };

    const handle = { start: vi.fn() };
    const createHandle = vi.fn(() => handle);

    const { unmount } = renderHook(() =>
      useMainThreadImperativeHandle(ref, createHandle, [])
    );

    waitFor(() => {
      expect(createHandle).toHaveBeenCalled();
      expect(ref.current).toBe(handle);
    });

    unmount();

    waitFor(() => {
      expect(ref.current).toBe(null);
    });
  });
});
