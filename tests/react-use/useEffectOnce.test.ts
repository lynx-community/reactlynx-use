import { renderHook } from '@lynx-js/react/testing-library';
import { useEffectOnce } from '../../src/react-use';

const mockEffectCleanup = vi.fn();
const mockEffectCallback = vi.fn().mockReturnValue(mockEffectCleanup);

beforeEach(() => {
  mockEffectCallback.mockClear();
  mockEffectCleanup.mockClear();
});

it.skip('should run provided effect only once', () => {
  const { rerender } = renderHook(() => useEffectOnce(mockEffectCallback));
  expect(mockEffectCallback).toHaveBeenCalledTimes(1);

  rerender();
  // FIXME
  expect(mockEffectCallback).toHaveBeenCalledTimes(1);
});

it('should run clean-up provided on unmount', () => {
  const { unmount } = renderHook(() => useEffectOnce(mockEffectCallback));
  expect(mockEffectCleanup).not.toHaveBeenCalled();

  unmount();
  expect(mockEffectCleanup).toHaveBeenCalledTimes(1);
});
