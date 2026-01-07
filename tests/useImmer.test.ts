import { act, renderHook } from '@lynx-js/react/testing-library';
import { useImmer } from '../src/index.js';

describe('useImmer', () => {
  it('should initialize with value', () => {
    const { result } = renderHook(() => useImmer({ count: 1 }));
    expect(result.current[0]).toEqual({ count: 1 });
  });

  it('should initialize with function', () => {
    const { result } = renderHook(() => useImmer(() => ({ count: 1 })));
    expect(result.current[0]).toEqual({ count: 1 });
  });

  it('should update with value', () => {
    const { result } = renderHook(() => useImmer({ count: 1 }));
    act(() => {
      result.current[1]({ count: 2 });
    });
    expect(result.current[0]).toEqual({ count: 2 });
  });

  it('should update with primitive value', () => {
    const { result } = renderHook(() => useImmer(1));
    act(() => {
      result.current[1](2);
    });
    expect(result.current[0]).toBe(2);
  });

  it('should update with producer function', () => {
    const { result } = renderHook(() => useImmer({ count: 1 }));
    act(() => {
      result.current[1]((draft) => {
        draft.count += 1;
      });
    });
    expect(result.current[0]).toEqual({ count: 2 });
  });

  it('should support deep updates', () => {
    const { result } = renderHook(() =>
      useImmer({ user: { name: 'John', details: { age: 30 } } }),
    );
    act(() => {
      result.current[1]((draft) => {
        draft.user.details.age = 31;
      });
    });
    expect(result.current[0].user.details.age).toBe(31);
    expect(result.current[0].user.name).toBe('John');
  });

  it('should maintain immutability', () => {
    const { result } = renderHook(() => useImmer({ count: 1 }));
    const initialState = result.current[0];

    act(() => {
      result.current[1]((draft) => {
        draft.count += 1;
      });
    });

    const nextState = result.current[0];
    expect(nextState).not.toBe(initialState);
    expect(initialState.count).toBe(1);
    expect(nextState.count).toBe(2);
  });

  it('should keep stable updater identity', () => {
    const { result, rerender } = renderHook(() => useImmer({ count: 1 }));
    const [, update1] = result.current;

    rerender();
    const [, update2] = result.current;

    expect(update1).toBe(update2);
  });
});
