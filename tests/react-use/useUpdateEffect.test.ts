import { renderHook } from '@lynx-js/react/testing-library';
import { useUpdateEffect } from '../../src/react-use';

it('should run effect on update', () => {
  const effect = vi.fn();

  const { rerender } = renderHook(() => useUpdateEffect(effect));
  expect(effect).not.toHaveBeenCalled();

  rerender();
  expect(effect).toHaveBeenCalledTimes(1);
});

it('should run cleanup on unmount', () => {
  const cleanup = vi.fn();
  const effect = vi.fn().mockReturnValue(cleanup);
  const hook = renderHook(() => useUpdateEffect(effect));

  hook.rerender();
  hook.unmount();

  expect(cleanup).toHaveBeenCalledTimes(1);
});
