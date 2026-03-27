// biome-ignore-all lint/suspicious/noExplicitAny: tests deliberately use loose refs for Lynx node stubs
import { useRef } from "@lynx-js/react";
import { act, render, waitFor } from "@lynx-js/react/testing-library";
import useTapAway from "../src/useTapAway";

describe("useTapAway (background-only)", () => {
  it("listens to tap and triggers callback only for outside taps", async () => {
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
    await waitFor(() =>
      expect(emitter.listeners.tap?.length ?? 0).toBeGreaterThan(0),
    );
    await waitFor(() => expect(boxRef?.current).toBeTruthy());
    const insideNode = boxRef?.current;

    act(() => {
      emitter.emit("tap", [{ target: insideNode }]);
    });
    expect(onTapAway).not.toHaveBeenCalled();

    act(() => {
      emitter.emit("tap", [{ target: undefined }]);
    });
    await waitFor(() => expect(onTapAway).toHaveBeenCalledTimes(1));
  });

  it("treats detail-only payload as outside when event.target is missing", async () => {
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
    await waitFor(() =>
      expect(emitter.listeners.tap?.length ?? 0).toBeGreaterThan(0),
    );
    await waitFor(() => expect(boxRef?.current).toBeTruthy());
    const insideNode = boxRef?.current;
    act(() => {
      emitter.emit("tap", [{ detail: { target: insideNode } }]);
    });
    await waitFor(() => expect(onTapAway).toHaveBeenCalledTimes(1));
  });

  it("treats same-uid non-node target as inside", async () => {
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
    await waitFor(() =>
      expect(emitter.listeners.tap?.length ?? 0).toBeGreaterThan(0),
    );
    await waitFor(() => expect(boxRef?.current).toBeTruthy());
    const insideNode = boxRef?.current as any;
    insideNode.uid = "box-uid";

    act(() => {
      emitter.emit("tap", [{ target: { uid: "box-uid" } }]);
    });

    await waitFor(() => expect(onTapAway).not.toHaveBeenCalled());
  });

  it("retries ref path resolution after empty path payload", async () => {
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
    await waitFor(() =>
      expect(emitter.listeners.tap?.length ?? 0).toBeGreaterThan(0),
    );
    await waitFor(() => expect(boxRef?.current).toBeTruthy());

    const refNode = boxRef?.current as any;
    const refPathData = [{ tag: "view", id: "box", index: 0, class: [], dataSet: {} }];
    let refPathCallCount = 0;
    refNode.path = vi.fn((cb: (data: unknown) => void) => ({
      exec: () => {
        refPathCallCount += 1;
        cb(refPathCallCount === 1 ? [] : refPathData);
      },
    }));

    const targetPathData = [
      { tag: "text", id: "", index: 0, class: [], dataSet: {} },
      ...refPathData,
    ];
    const pathByUid = () => ({
      path: (cb: (data: unknown) => void) => ({
        exec: () => cb(targetPathData),
      }),
    });

    const originalCreateSelectorQuery = lynx.createSelectorQuery;
    (lynx as any).createSelectorQuery = vi.fn(() => ({
      selectUniqueID: pathByUid,
    }));

    try {
      const target = { uid: "target-uid" };

      act(() => {
        emitter.emit("tap", [{ target }]);
      });
      await waitFor(() => expect(onTapAway).toHaveBeenCalledTimes(1));

      act(() => {
        emitter.emit("tap", [{ target }]);
      });
      await waitFor(() => expect(onTapAway).toHaveBeenCalledTimes(2));

      act(() => {
        emitter.emit("tap", [{ target }]);
      });
      await waitFor(() => expect(onTapAway).toHaveBeenCalledTimes(2));
      expect(refPathCallCount).toBe(2);
    } finally {
      (lynx as any).createSelectorQuery = originalCreateSelectorQuery;
    }
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
      expect(emitter.listeners.tap?.length ?? 0).toBeGreaterThan(0),
    );
    await waitFor(() => expect(innerRef?.current).toBeTruthy());

    unmount();

    act(() => {
      emitter.emit("tap", [{ target: undefined }]);
    });
    await waitFor(() => expect(onTapAway).not.toHaveBeenCalled());
  });
});
