import { renderHook } from '@lynx-js/react/testing-library';
import useUniqueId from '../src/useUniqueId.js';

describe('useUniqueId', () => {
  it('should generate a string id', () => {
    const { result } = renderHook(() => useUniqueId());
    expect(typeof result.current).toBe('string');
    expect(result.current.length).toBeGreaterThan(0);
  });

  it('should be unique', () => {
    const { result: result1 } = renderHook(() => useUniqueId());
    const { result: result2 } = renderHook(() => useUniqueId());
    expect(result1.current).not.toBe(result2.current);
  });

  it('should be stable across re-renders', () => {
    const { result, rerender } = renderHook(() => useUniqueId());
    const id1 = result.current;
    rerender();
    const id2 = result.current;
    expect(id1).toBe(id2);
  });

  it('should use prefix', () => {
    const prefix = 'my-prefix-';
    const { result } = renderHook(() => useUniqueId(prefix));
    expect(result.current.startsWith(prefix)).toBe(true);
  });
});
