import { act, renderHook } from "@lynx-js/react/testing-library";
import type { UIAppearanceTargetDetail } from "../../src/exposureBased/types";
import { useStayTime } from "../../src/react-use";

describe("useStayTime", () => {
  const sleep = (time: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, time));

  it("returns empty exposure props when controlled by isStaying", () => {
    const { result } = renderHook(() => useStayTime({ isStaying: true }));
    expect(result.current.exposureProps).toEqual({});
  });

  it("exposes bind handlers when uncontrolled", () => {
    const { result } = renderHook(() => useStayTime());
    expect(typeof result.current.exposureProps.binduiappear).toBe("function");
    expect(typeof result.current.exposureProps.binduidisappear).toBe(
      "function"
    );
  });

  it("starts and stops when binduiappear / binduidisappear fire", () => {
    const detail: UIAppearanceTargetDetail = {
      "exposure-id": "node-1",
      "exposure-scene": "scene-a",
      "unique-id": "uid-1",
      dataset: {},
    };
    const onRunningChange = vi.fn();
    const hook = renderHook(() => useStayTime({ onRunningChange }));

    act(() => {
      hook.result.current.exposureProps.binduiappear?.(detail);
    });
    expect(hook.result.current.isRunning).toBe(true);

    act(() => {
      hook.result.current.exposureProps.binduidisappear?.(detail);
    });
    expect(hook.result.current.isRunning).toBe(false);

    expect(onRunningChange).toHaveBeenCalledWith(
      expect.objectContaining({ isRunning: true })
    );
    expect(onRunningChange).toHaveBeenCalledWith(
      expect.objectContaining({ isRunning: false })
    );
  });

  it("tracks stay time via exposure events and supports controls", async () => {
    const detail: UIAppearanceTargetDetail = {
      "exposure-id": "node-1",
      "exposure-scene": "scene-a",
      "unique-id": "uid-1",
      dataset: {},
    };
    const onRunningChange = vi.fn();
    const hook = renderHook(() => useStayTime({ onRunningChange }));

    act(() => {
      hook.result.current.exposureProps.binduiappear?.(detail);
    });
    await sleep(30);
    expect(hook.result.current.isRunning).toBe(true);
    const during = hook.result.current.stayTimeMs;
    expect(during).toBeGreaterThan(0);

    act(() => {
      hook.result.current.pause();
    });
    const paused = hook.result.current.stayTimeMs;
    await sleep(20);
    expect(hook.result.current.stayTimeMs).toBe(paused);

    act(() => {
      hook.result.current.resume();
    });
    await sleep(20);
    expect(hook.result.current.stayTimeMs).toBeGreaterThan(paused);

    act(() => {
      hook.result.current.exposureProps.binduidisappear?.(detail);
    });
    await sleep(10);
    expect(hook.result.current.isRunning).toBe(false);

    act(() => {
      hook.result.current.reset();
    });
    expect(hook.result.current.stayTimeMs).toBe(0);

    hook.unmount();
    expect(onRunningChange).toHaveBeenCalledWith(
      expect.objectContaining({ isRunning: true })
    );
    expect(onRunningChange).toHaveBeenCalledWith(
      expect.objectContaining({ isRunning: false })
    );
  });

  it("tracks stay time when isStaying is true and supports pause/resume/reset", async () => {
    const onRunningChange = vi.fn();
    const hook = renderHook(() =>
      useStayTime({ isStaying: true, onRunningChange })
    );

    await sleep(50);
    expect(hook.result.current.isRunning).toBe(true);
    const first = hook.result.current.stayTimeMs;
    expect(first).toBeGreaterThan(0);

    act(() => {
      hook.result.current.pause();
    });
    const paused = hook.result.current.stayTimeMs;
    expect(hook.result.current.isRunning).toBe(false);
    expect(paused).toBeGreaterThanOrEqual(first);

    await sleep(50);
    expect(hook.result.current.stayTimeMs).toBe(paused);

    act(() => {
      hook.result.current.resume();
    });
    await sleep(50);
    expect(hook.result.current.isRunning).toBe(true);
    const resumed = hook.result.current.stayTimeMs;
    expect(resumed).toBeGreaterThan(paused);

    act(() => {
      hook.result.current.reset();
    });
    expect(hook.result.current.stayTimeMs).toBe(0);

    hook.unmount();
    expect(onRunningChange).toHaveBeenCalledWith({
      isRunning: true,
      stayTimeMs: 0,
    });
    expect(onRunningChange).toHaveBeenCalledWith({
      isRunning: false,
      stayTimeMs: paused,
    });
  });
});
