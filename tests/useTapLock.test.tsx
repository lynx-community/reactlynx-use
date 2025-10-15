import { type MainThreadRef, runOnMainThread } from "@lynx-js/react";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import useTapLock from "../src/useTapLock";

describe("useTapLock", () => {
  it("should initialize with tap lock enabled", async () => {
    let tapLockRef: MainThreadRef<boolean> | null = null;
    const Comp = () => {
      const {
        tapLockRef: hookTapLockRef,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
      } = useTapLock();

      tapLockRef = hookTapLockRef;

      return (
        <view
          main-thread:bindtouchstart={handleTouchStart}
          main-thread:bindtouchmove={handleTouchMove}
          main-thread:bindtouchend={handleTouchEnd}
        ></view>
      );
    };

    render(<Comp />);

    const checkTapLockRef = runOnMainThread(() => {
      "main thread";
      return tapLockRef?.current;
    });

    expect(await checkTapLockRef()).toBe(true);
  });

  describe("direction: x (default)", () => {
    it("should unlock when x exceeds default threshold", async () => {
      let tapLockRef: MainThreadRef<boolean> | null = null;
      const Comp = () => {
        const {
          tapLockRef: hookTapLockRef,
          handleTouchStart,
          handleTouchMove,
          handleTouchEnd,
        } = useTapLock();

        tapLockRef = hookTapLockRef;

        return (
          <view
            main-thread:bindtouchstart={handleTouchStart}
            main-thread:bindtouchmove={handleTouchMove}
            main-thread:bindtouchend={handleTouchEnd}
          ></view>
        );
      };

      const { container } = render(<Comp />);

      const checkTapLockRef = runOnMainThread(() => {
        "main thread";
        return tapLockRef?.current;
      });

      fireEvent.touchstart(container.firstChild, {
        detail: { x: 10, y: 10 },
      });

      fireEvent.touchmove(container.firstChild, {
        detail: { x: 20, y: 10 },
      });

      expect(await checkTapLockRef()).toBe(false);
    });

    it("should remain locked when x within threshold but y exceeds", async () => {
      let tapLockRef: MainThreadRef<boolean> | null = null;
      const Comp = () => {
        const {
          tapLockRef: hookTapLockRef,
          handleTouchStart,
          handleTouchMove,
          handleTouchEnd,
        } = useTapLock();

        tapLockRef = hookTapLockRef;

        return (
          <view
            main-thread:bindtouchstart={handleTouchStart}
            main-thread:bindtouchmove={handleTouchMove}
            main-thread:bindtouchend={handleTouchEnd}
          ></view>
        );
      };

      const { container } = render(<Comp />);

      const checkTapLockRef = runOnMainThread(() => {
        "main thread";
        return tapLockRef?.current;
      });

      fireEvent.touchstart(container.firstChild, {
        detail: { x: 10, y: 10 },
      });

      fireEvent.touchmove(container.firstChild, {
        detail: { x: 15, y: 30 },
      });

      expect(await checkTapLockRef()).toBe(true);
    });

    it("should unlock when x exceeds custom threshold", async () => {
      let tapLockRef: MainThreadRef<boolean> | null = null;
      const Comp = () => {
        const {
          tapLockRef: hookTapLockRef,
          handleTouchStart,
          handleTouchMove,
          handleTouchEnd,
        } = useTapLock({ tapThreshold: 20 });

        tapLockRef = hookTapLockRef;

        return (
          <view
            main-thread:bindtouchstart={handleTouchStart}
            main-thread:bindtouchmove={handleTouchMove}
            main-thread:bindtouchend={handleTouchEnd}
          ></view>
        );
      };

      const { container } = render(<Comp />);

      const checkTapLockRef = runOnMainThread(() => {
        "main thread";
        return tapLockRef?.current;
      });

      fireEvent.touchstart(container.firstChild, {
        detail: { x: 10, y: 10 },
      });

      fireEvent.touchmove(container.firstChild, {
        detail: { x: 18, y: 10 },
      });

      expect(await checkTapLockRef()).toBe(true);

      fireEvent.touchend(container.firstChild, {
        detail: { x: 31, y: 10 },
      });

      expect(await checkTapLockRef()).toBe(false);
    });
  });

  describe("direction: y", () => {
    it("should unlock when y exceeds threshold", async () => {
      let tapLockRef: MainThreadRef<boolean> | null = null;
      const Comp = () => {
        const {
          tapLockRef: hookTapLockRef,
          handleTouchStart,
          handleTouchMove,
          handleTouchEnd,
        } = useTapLock({ direction: "y" });

        tapLockRef = hookTapLockRef;

        return (
          <view
            main-thread:bindtouchstart={handleTouchStart}
            main-thread:bindtouchmove={handleTouchMove}
            main-thread:bindtouchend={handleTouchEnd}
          ></view>
        );
      };

      const { container } = render(<Comp />);

      const checkTapLockRef = runOnMainThread(() => {
        "main thread";
        return tapLockRef?.current;
      });

      fireEvent.touchstart(container.firstChild, {
        detail: { x: 10, y: 10 },
      });

      fireEvent.touchmove(container.firstChild, {
        detail: { x: 10, y: 20 },
      });

      expect(await checkTapLockRef()).toBe(false);
    });

    it("should remain locked when y within threshold but x exceeds", async () => {
      let tapLockRef: MainThreadRef<boolean> | null = null;
      const Comp = () => {
        const {
          tapLockRef: hookTapLockRef,
          handleTouchStart,
          handleTouchMove,
          handleTouchEnd,
        } = useTapLock({ direction: "y" });

        tapLockRef = hookTapLockRef;

        return (
          <view
            main-thread:bindtouchstart={handleTouchStart}
            main-thread:bindtouchmove={handleTouchMove}
            main-thread:bindtouchend={handleTouchEnd}
          ></view>
        );
      };

      const { container } = render(<Comp />);

      const checkTapLockRef = runOnMainThread(() => {
        "main thread";
        return tapLockRef?.current;
      });

      fireEvent.touchstart(container.firstChild, {
        detail: { x: 10, y: 10 },
      });

      fireEvent.touchmove(container.firstChild, {
        detail: { x: 30, y: 15 },
      });

      expect(await checkTapLockRef()).toBe(true);
    });
  });

  describe("direction: both", () => {
    it("should unlock when x exceeds threshold", async () => {
      let tapLockRef: MainThreadRef<boolean> | null = null;
      const Comp = () => {
        const {
          tapLockRef: hookTapLockRef,
          handleTouchStart,
          handleTouchMove,
          handleTouchEnd,
        } = useTapLock({ direction: "both" });

        tapLockRef = hookTapLockRef;

        return (
          <view
            main-thread:bindtouchstart={handleTouchStart}
            main-thread:bindtouchmove={handleTouchMove}
            main-thread:bindtouchend={handleTouchEnd}
          ></view>
        );
      };

      const { container } = render(<Comp />);

      const checkTapLockRef = runOnMainThread(() => {
        "main thread";
        return tapLockRef?.current;
      });

      fireEvent.touchstart(container.firstChild, {
        detail: { x: 10, y: 10 },
      });

      fireEvent.touchmove(container.firstChild, {
        detail: { x: 20, y: 10 },
      });

      expect(await checkTapLockRef()).toBe(false);
    });

    it("should unlock when y exceeds threshold", async () => {
      let tapLockRef: MainThreadRef<boolean> | null = null;
      const Comp = () => {
        const {
          tapLockRef: hookTapLockRef,
          handleTouchStart,
          handleTouchMove,
          handleTouchEnd,
        } = useTapLock({ direction: "both" });

        tapLockRef = hookTapLockRef;

        return (
          <view
            main-thread:bindtouchstart={handleTouchStart}
            main-thread:bindtouchmove={handleTouchMove}
            main-thread:bindtouchend={handleTouchEnd}
          ></view>
        );
      };

      const { container } = render(<Comp />);

      const checkTapLockRef = runOnMainThread(() => {
        "main thread";
        return tapLockRef?.current;
      });

      fireEvent.touchstart(container.firstChild, {
        detail: { x: 10, y: 10 },
      });

      fireEvent.touchmove(container.firstChild, {
        detail: { x: 10, y: 20 },
      });

      expect(await checkTapLockRef()).toBe(false);
    });

    it("should unlock when both x and y exceed threshold", async () => {
      let tapLockRef: MainThreadRef<boolean> | null = null;
      const Comp = () => {
        const {
          tapLockRef: hookTapLockRef,
          handleTouchStart,
          handleTouchMove,
          handleTouchEnd,
        } = useTapLock({ direction: "both" });

        tapLockRef = hookTapLockRef;

        return (
          <view
            main-thread:bindtouchstart={handleTouchStart}
            main-thread:bindtouchmove={handleTouchMove}
            main-thread:bindtouchend={handleTouchEnd}
          ></view>
        );
      };

      const { container } = render(<Comp />);

      const checkTapLockRef = runOnMainThread(() => {
        "main thread";
        return tapLockRef?.current;
      });

      fireEvent.touchstart(container.firstChild, {
        detail: { x: 10, y: 10 },
      });

      fireEvent.touchmove(container.firstChild, {
        detail: { x: 20, y: 20 },
      });

      expect(await checkTapLockRef()).toBe(false);
    });

    it("should remain locked when both x and y within threshold", async () => {
      let tapLockRef: MainThreadRef<boolean> | null = null;
      const Comp = () => {
        const {
          tapLockRef: hookTapLockRef,
          handleTouchStart,
          handleTouchMove,
          handleTouchEnd,
        } = useTapLock({ direction: "both" });

        tapLockRef = hookTapLockRef;

        return (
          <view
            main-thread:bindtouchstart={handleTouchStart}
            main-thread:bindtouchmove={handleTouchMove}
            main-thread:bindtouchend={handleTouchEnd}
          ></view>
        );
      };

      const { container } = render(<Comp />);

      const checkTapLockRef = runOnMainThread(() => {
        "main thread";
        return tapLockRef?.current;
      });

      fireEvent.touchstart(container.firstChild, {
        detail: { x: 10, y: 10 },
      });

      fireEvent.touchmove(container.firstChild, {
        detail: { x: 15, y: 15 },
      });

      expect(await checkTapLockRef()).toBe(true);
    });
  });
});
