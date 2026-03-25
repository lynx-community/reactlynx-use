import { act, renderHook } from '@lynx-js/react/testing-library';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSetInitData } from '../src/useSetInitData.js';

const mockUseInitData = vi.fn();

vi.mock('@lynx-js/react', async () => {
  const actual = await vi.importActual('@lynx-js/react');
  return {
    ...actual,
    useInitData: () => mockUseInitData(),
  };
});

describe('useSetInitData', () => {
  beforeEach(() => {
    mockUseInitData.mockReset();
  });

  it('should initialize state with initData', () => {
    const initData = { foo: 'bar' };
    mockUseInitData.mockReturnValue(initData);

    const { result } = renderHook(() => useSetInitData());

    expect(result.current[0]).toEqual(initData);
  });

  it('should allow updating state', () => {
    const initData = { count: 0 };
    mockUseInitData.mockReturnValue(initData);

    const { result } = renderHook(() => useSetInitData());

    expect(result.current[0]).toEqual(initData);

    act(() => {
      result.current[1]({ count: 1 });
    });

    expect(result.current[0]).toEqual({ count: 1 });
  });
});
