import { act, renderHook } from '@lynx-js/react/testing-library';
import type { UIAppearanceTargetDetail } from '../../src/exposureBased/types';
import { useExposureForNode } from '../../src/react-use';

describe('useExposureForNode', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns exposure props with attrs and handlers', () => {
    const { result } = renderHook(() =>
      useExposureForNode<{ custom?: string }>({
        attrs: { 'exposure-id': 'hero', custom: 'mark' },
      }),
    );

    const props = result.current.exposureProps;
    expect(result.current.isInView).toBe(false);
    expect(props['exposure-id']).toBe('hero');
    expect(props.custom).toBe('mark');
    expect(typeof props.binduiappear).toBe('function');
    expect(typeof props.binduidisappear).toBe('function');
  });

  it('invokes callbacks on appear and disappear', () => {
    const onAppear = vi.fn();
    const onDisappear = vi.fn();
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useExposureForNode({ onAppear, onDisappear, onChange }),
    );

    const props = result.current.exposureProps;
    const detail: UIAppearanceTargetDetail = {
      'exposure-id': 'foo',
      'exposure-scene': 'scene',
      'unique-id': 'uid-1',
      dataset: {},
    };

    act(() => {
      props.binduiappear?.(detail);
    });

    expect(result.current.isInView).toBe(true);
    expect(onAppear).toHaveBeenCalledWith(detail);
    expect(onChange).toHaveBeenCalledWith(detail, { isInView: true });

    act(() => {
      props.binduidisappear?.(detail);
    });

    expect(result.current.isInView).toBe(false);
    expect(onDisappear).toHaveBeenCalledWith(detail);
    expect(onChange).toHaveBeenCalledWith(detail, { isInView: false });
  });

  it('waits for admissionTimeMs before admitting', () => {
    vi.useFakeTimers();
    const onAppear = vi.fn();
    const { result } = renderHook(() =>
      useExposureForNode({ admissionTimeMs: 50, onAppear }),
    );

    const detail: UIAppearanceTargetDetail = {
      'exposure-id': 'foo',
      'exposure-scene': 'scene',
      'unique-id': 'uid-1',
      dataset: {},
    };

    act(() => {
      result.current.exposureProps.binduiappear?.(detail);
    });

    expect(onAppear).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(49);
    });
    expect(result.current.isInView).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onAppear).toHaveBeenCalledTimes(1);
    expect(result.current.isInView).toBe(true);
  });
});
