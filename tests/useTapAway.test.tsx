// biome-ignore-all lint/suspicious/noExplicitAny: tests deliberately use loose refs for Lynx node stubs
import { useRef } from "@lynx-js/react";
import { act, render, waitFor } from "@lynx-js/react/testing-library";
import useTapAway from "../src/useTapAway";

describe("useTapAway (background-only)", () => {
  it("invokes callback when tap happens outside target", async () => {
    const onTapAway = vi.fn();
    let boxRef: ReturnType<typeof useRef<any>> | null = null;

    const Comp = () => {
      const ref = useRef<any>(null);
      boxRef = ref;
      useTapAway(ref, onTapAway);
      return <view ref={ref} />;
    };

    render(<Comp />);
    const emitter = lynx.getJSModule("GlobalEventEmitter");

    // wait for effect to register listener
    await waitFor(() =>
      expect(emitter.listeners.bindtap?.length ?? 0).toBeGreaterThan(0),
    );
    await waitFor(() => expect(boxRef?.current).toBeTruthy());
    const insideNode = boxRef?.current;
    await waitFor(() =>
      expect(emitter.listeners.bindtap?.length ?? 0).toBeGreaterThan(0),
    );

    act(() => {
      emitter.emit("bindtap", [{ target: insideNode }]);
    });
    expect(onTapAway).not.toHaveBeenCalled();

    act(() => {
      emitter.emit("bindtap", [{ target: undefined }]);
    });
    await waitFor(() => expect(onTapAway).toHaveBeenCalledTimes(1));
  });

  it("cleans up listener on unmount", async () => {
    const onTapAway = vi.fn();
    let innerRef: ReturnType<typeof useRef<any>> | null = null;

    const Comp = () => {
      const ref = useRef<any>(null);
      innerRef = ref;
      useTapAway(ref, onTapAway);
      return <view ref={ref} />;
    };

    const { unmount } = render(<Comp />);
    const emitter = lynx.getJSModule("GlobalEventEmitter");

    await waitFor(() =>
      expect(emitter.listeners.bindtap?.length ?? 0).toBeGreaterThan(0),
    );
    await waitFor(() => expect(innerRef?.current).toBeTruthy());
    await waitFor(() =>
      expect(emitter.listeners.bindtap?.length ?? 0).toBeGreaterThan(0),
    );

    unmount();

    act(() => {
      emitter.emit("bindtap", [{ target: undefined }]);
    });
    await waitFor(() => expect(onTapAway).not.toHaveBeenCalled());
  });

  it("supports custom event names and detail.target", async () => {
    const onTapAway = vi.fn();
    let boxRef: ReturnType<typeof useRef<any>> | null = null;

    const Comp = () => {
      const ref = useRef<any>(null);
      boxRef = ref;
      useTapAway(ref, onTapAway, ["customtap"]);
      return <view ref={ref} />;
    };

    render(<Comp />);
    const emitter = lynx.getJSModule("GlobalEventEmitter");

    await waitFor(() =>
      expect(emitter.listeners.customtap?.length ?? 0).toBeGreaterThan(0),
    );
    await waitFor(() => expect(boxRef?.current).toBeTruthy());
    const insideNode = boxRef?.current;
    await waitFor(() =>
      expect(emitter.listeners.customtap?.length ?? 0).toBeGreaterThan(0),
    );

    act(() => {
      emitter.emit("customtap", [{ detail: { target: insideNode } }]);
    });
    act(() => {
      emitter.emit("customtap", [{ detail: { target: undefined } }]);
    });
    await waitFor(() => expect(onTapAway).toHaveBeenCalledTimes(1));
  });
});
