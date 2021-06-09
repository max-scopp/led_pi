import { Main } from "main";
import { DynamicEffect } from "util/effect";
import { CHSV } from "util/hsv";
import { print } from "util/print";
import { HUE_END, MS_PER_SECOND, S_PER_MINUTE } from "../constants";

/**
 * Rainbow effect, progression is based over time.
 * You can choose any FPS to achieve the same progress over time X.
 * This effect is not based on fps and is therefore deactivated.
 */
export class RainbowFancy extends DynamicEffect {
  FRAMES_PER_SECOND = -1;

  /**
   * How fast the hue is moving
   */
  speed = 50;

  /**
   * How wide the hue is spread
   */
  hueDensity = 15;

  draw(t: number) {
    Main.strip.map((position, count) => {
      const pixelProgress = this.hueDensity * position;
      const stepHue = t / this.speed + pixelProgress;

      return new CHSV(Math.round(stepHue % HUE_END), 1, 1);
    });
  }
}
