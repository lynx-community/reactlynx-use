import { renderHook } from '@lynx-js/react/testing-library';
import { default as useEventListener } from '../src/useEventListener';

describe('useLynxGlobalEventListener', () => {
  it('should add event listener and respond to events', () => {
    const listener = vi.fn();
    const eventName = 'testEvent';

    renderHook(() => useEventListener(eventName, listener));

    lynx.getJSModule('GlobalEventEmitter').emit(eventName, [{
      data: {
        foo: 'bar',
      },
    }]);

    expect(listener).toHaveBeenCalledWith({ data: { foo: 'bar' } });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should remove event listener on unmount', () => {
    const listener = vi.fn();
    const eventName = 'testEvent';

    const { unmount } = renderHook(() => useEventListener(eventName, listener));

    unmount();

    lynx.getJSModule('GlobalEventEmitter').emit(eventName, [{
      data: {
        foo: 'bar',
      },
    }]);

    expect(listener).not.toHaveBeenCalled();
  });
});
