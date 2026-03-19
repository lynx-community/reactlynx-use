import { act, renderHook } from "@lynx-js/react/testing-library";
import type { ListScrollEvent } from "@lynx-js/types";
import { useListScrollEvent } from "../../src/react-use";

describe("useListScrollEvent", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns list scroll props with attrs and handlers", () => {
    const { result } = renderHook(() =>
      useListScrollEvent<{ custom?: string }>({
        attrs: {
          "scroll-event-throttle": 20,
          "lower-threshold-item-count": 5,
          "upper-threshold-item-count": 5,
        },
      })
    );
    const props = result.current.listScrollEventsAndAttrs;
    expect(props["scroll-event-throttle"]).toBe(20);
    expect(props["lower-threshold-item-count"]).toBe(5);
    expect(props["upper-threshold-item-count"]).toBe(5);
  });

  it("invokes callbacks onScroll, onScrollToLower, onScrollToUpper", () => {
    const onScroll = vi.fn();
    const onScrollToLower = vi.fn();
    const onScrollToUpper = vi.fn();

    const { result } = renderHook(() =>
      useListScrollEvent({ 
        attrs: {
          "custom-list-name": "list-container",
          "lower-threshold-item-count": 5,
          "upper-threshold-item-count": 5,
        },
        onScroll, 
        onScrollToLower, 
        onScrollToUpper
      })
    );
    const props = result.current.listScrollEventsAndAttrs;
    const target = {
      id: "list",
      uid: 1,
      dataset: {},
    };
    const scrollEvent : ListScrollEvent = {
      type: "scroll",
      timestamp: 0,
      target: target,
      currentTarget: target,
      detail: {
        scrollLeft: 0,
        scrollTop: 0,
        scrollWidth: 0,
        scrollHeight: 0,
        listWidth: 0,
        listHeight: 0,
        deltaX: 0,
        deltaY: 0,
        eventSource: 2,
        attachedCells: [],
      }
    }
    act(() => {
      props.bindscroll?.(scrollEvent);
    });
    expect(onScroll).toHaveBeenCalledWith(scrollEvent);
  });

  it("test dynamic binding of event handlers", () => {
    // We use rerender to simulate the component re-rendering with different props
    // (i.e., dynamically adding or removing event handlers).
  
    // 1. Initial State: Do not pass any event handlers, assert that all three event bindings do not exist (undefined).
    let currentProps: any = {
      attrs: {},
    };

    const { result, rerender } = renderHook(() =>
      useListScrollEvent(currentProps)
    );

    let props = result.current.listScrollEventsAndAttrs;
    expect(props.bindscroll).toBeUndefined();
    expect(props.bindscrolltolower).toBeUndefined();
    expect(props.bindscrolltoupper).toBeUndefined();

    // 2. Add onScroll: Pass onScroll through rerender, assert that bindscroll is bound, while the other two remain undefined.
    const onScroll = vi.fn();
    currentProps = { ...currentProps, onScroll };
    // Invoke rerender to run the callback in renderHook.
    rerender();
    props = result.current.listScrollEventsAndAttrs;
    expect(props.bindscroll).toBeDefined();
    expect(props.bindscrolltolower).toBeUndefined();
    expect(props.bindscrolltoupper).toBeUndefined();

    // 3. Add remaining two events: Pass all event handlers through rerender, assert that all events are correctly bound.
    const onScrollToLower = vi.fn();
    const onScrollToUpper = vi.fn();
    currentProps = { ...currentProps, onScrollToLower, onScrollToUpper };
    rerender();
    props = result.current.listScrollEventsAndAttrs;
    expect(props.bindscroll).toBeDefined();
    expect(props.bindscrolltolower).toBeDefined();
    expect(props.bindscrolltoupper).toBeDefined();

    // 4. Remove event: Set onScroll to undefined, assert that bindscroll reverts to undefined.
    currentProps = { ...currentProps, onScroll: undefined };
    rerender();
    props = result.current.listScrollEventsAndAttrs;
    expect(props.bindscroll).toBeUndefined();
    expect(props.bindscrolltolower).toBeDefined();
    expect(props.bindscrolltoupper).toBeDefined();
  });

  it("test filterScrollToLowerEventWithEventSource", () => {
    // 1. Default behavior (filter is true): DIFF(0) and LAYOUT(1) should be filtered
    const onScrollToLower = vi.fn();
    let currentOptions: any = {
      attrs: {},
      onScrollToLower,
    };
    const { result, rerender } = renderHook(() =>
      useListScrollEvent(currentOptions)
    );
    let props = result.current.listScrollEventsAndAttrs;
    const mockEvent = (eventSource?: number) => ({
      type: "scrolltolower",
      timestamp: 0,
      target: { id: "list", uid: 1, dataset: {} },
      currentTarget: { id: "list", uid: 1, dataset: {} },
      detail: {
        scrollLeft: 0, scrollTop: 0, scrollWidth: 0, scrollHeight: 0,
        listWidth: 0, listHeight: 0, deltaX: 0, deltaY: 0,
        attachedCells: [],
        eventSource
      }
    } as any);
    act(() => {
      props.bindscrolltolower?.(mockEvent(0));
      props.bindscrolltolower?.(mockEvent(1));
    });
    expect(onScrollToLower).not.toHaveBeenCalled();
    // 2. SCROLL(2) should pass
    act(() => {
      props.bindscrolltolower?.(mockEvent(2));
    });
    expect(onScrollToLower).toHaveBeenCalledTimes(1);
    
    // set filterScrollToLowerEventWithEventSource to false
    currentOptions = { ...currentOptions, filterScrollToLowerEventWithEventSource: false };
    rerender(currentOptions);
    // After rerender, we must get the latest props from result.current
    props = result.current.listScrollEventsAndAttrs;
    act(() => {
      props.bindscrolltolower?.(mockEvent(0));
      props.bindscrolltolower?.(mockEvent(1));
      props.bindscrolltolower?.(mockEvent(2));
    });
    // 1 call from before + 3 calls now = 4 calls total
    expect(onScrollToLower).toHaveBeenCalledTimes(4);
  });

  it("test filterScrollToUpperEventWithEventSource", () => {
    // 1. Default behavior (filter is true): DIFF(0) and LAYOUT(1) should be filtered
    const onScrollToUpper = vi.fn();
    let currentOptions: any = {
      attrs: {},
      onScrollToUpper,
    };
    const { result, rerender } = renderHook(() =>
      useListScrollEvent(currentOptions)
    );
    let props = result.current.listScrollEventsAndAttrs;
    const mockEvent = (eventSource?: number) => ({
      type: "scrolltoupper",
      timestamp: 0,
      target: { id: "list", uid: 1, dataset: {} },
      currentTarget: { id: "list", uid: 1, dataset: {} },
      detail: {
        scrollLeft: 0, scrollTop: 0, scrollWidth: 0, scrollHeight: 0,
        listWidth: 0, listHeight: 0, deltaX: 0, deltaY: 0,
        attachedCells: [],
        eventSource
      }
    } as any);
    act(() => {
      props.bindscrolltoupper?.(mockEvent(0));
      props.bindscrolltoupper?.(mockEvent(1));
    });
    expect(onScrollToUpper).not.toHaveBeenCalled();
    
    // 2. SCROLL(2) should pass
    act(() => {
      props.bindscrolltoupper?.(mockEvent(2));
    });
    expect(onScrollToUpper).toHaveBeenCalledTimes(1);
    
    // set filterScrollToUpperEventWithEventSource to false
    currentOptions = { ...currentOptions, filterScrollToUpperEventWithEventSource: false };
    rerender(currentOptions);
    // After rerender, we must get the latest props from result.current
    props = result.current.listScrollEventsAndAttrs;
    act(() => {
      props.bindscrolltoupper?.(mockEvent(0));
      props.bindscrolltoupper?.(mockEvent(1));
      props.bindscrolltoupper?.(mockEvent(2));
    });
    // 1 call from before + 3 calls now = 4 calls total
    expect(onScrollToUpper).toHaveBeenCalledTimes(4);
  })
});
