import { Main } from "main";
import { DynamicEffect } from "common/effect";
import { CHSV } from "core/hsv";
import { print } from "util/print";
import { HUE_END, MS_PER_SECOND, S_PER_MINUTE } from "../../../constants";

/**
 * Rainbow effect, progression is based over time.
 * You can choose any FPS to achieve the same progress over time X.
 * This effect is not based on fps and is therefore deactivated.
 */
export class RainbowFancy extends DynamicEffect {
  /**
   * How fast the hue is moving.
   * Higher is slower, lower is faster.
   */
  speed = 12;

  /**
   * How wide the hue is spread
   */
  hueDensity = 5;

  draw(t: number) {
    Main.strips?.default.map((position, count) => {
      const pixelProgress = this.hueDensity * position;
      const stepHue = t / this.speed - pixelProgress;

      return new CHSV(Math.round(stepHue % HUE_END), 1, 1);
    });
  }
}
