import { renderHook } from '@lynx-js/react/testing-library';
import { useUnmount } from '../../src/react-use';

describe('useUnmount', () => {
  it('should be defined', () => {
    expect(useUnmount).toBeDefined();
  });

  it('should not call provided callback on mount', () => {
    const spy = vi.fn();
    renderHook(() => useUnmount(spy));

    expect(spy).not.toHaveBeenCalled();
  });

  it('should not call provided callback on re-renders', () => {
    const spy = vi.fn();
    const hook = renderHook(() => useUnmount(spy));

    hook.rerender();
    hook.rerender();
    hook.rerender();
    hook.rerender();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should call provided callback on unmount', () => {
    const spy = vi.fn();
    const hook = renderHook(() => useUnmount(spy));

    hook.unmount();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call provided callback if is has been changed', () => {
    const spy = vi.fn();
    const spy2 = vi.fn();
    const spy3 = vi.fn();
    const hook = renderHook((cb) => useUnmount(cb), { initialProps: spy });

    hook.rerender(spy2);
    hook.rerender(spy3);
    hook.unmount();

    expect(spy).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
    expect(spy3).toHaveBeenCalledTimes(1);
  });
});
