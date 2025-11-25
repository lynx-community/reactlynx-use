import { act, renderHook } from "@lynx-js/react/testing-library";
import type { UIAppearanceTargetDetail } from "../../src/exposureBased/types";
import { useExposureForPage } from "../../src/react-use";

describe("useExposureForPage", () => {
  it("builds per-item exposure props", () => {
    const { result } = renderHook(() =>
      useExposureForPage<{ extra?: string }>({
        attrs: { "exposure-scene": "feed" },
      })
    );

    const props = result.current.exposureProps({
      id: "item-1",
      extra: { extra: "value" },
    });

    expect(props["exposure-id"]).toBe("item-1");
    expect(props["exposure-scene"]).toBe("feed");
    expect(props.extra).toBe("value");
  });

  it("tracks visibility via exposure events", async () => {
    const emitter = lynx.getJSModule("GlobalEventEmitter");
    const onAppear = vi.fn();
    const onDisappear = vi.fn();
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useExposureForPage({ onAppear, onDisappear, onChange })
    );

    const detail: UIAppearanceTargetDetail = {
      "exposure-id": "card-1",
      "exposure-scene": "scene-a",
      "unique-id": "uid-1",
      dataset: {},
    };

    act(() => {
      emitter.emit("exposure", [[detail]]);
    });
    expect(result.current.isInView("card-1")).toBe(true);
    expect(onAppear).toHaveBeenCalledWith(detail, {
      exposureId: "card-1",
      exposureScene: "scene-a",
    });
    expect(onChange).toHaveBeenLastCalledWith(detail, {
      isInView: true,
      exposureId: "card-1",
      exposureScene: "scene-a",
    });

    act(() => {
      emitter.emit("disexposure", [[detail]]);
    });
    expect(result.current.isInView("card-1")).toBe(false);
    expect(onDisappear).toHaveBeenCalledWith(detail, {
      exposureId: "card-1",
      exposureScene: "scene-a",
    });
    expect(onChange).toHaveBeenLastCalledWith(detail, {
      isInView: false,
      exposureId: "card-1",
      exposureScene: "scene-a",
    });
  });
});
