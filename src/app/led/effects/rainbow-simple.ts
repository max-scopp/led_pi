import { Main } from "main";
import { DynamicEffect } from "common/effect";
import { CHSV } from "core/hsv";

/**
 * The most basic rainbow effect possible.
 * Initializes by filling the strip with an rainbow,
 * then, each draw shifts the existing rainbow by 1.
 *
 * Use negative values to change the direction.
 */
export class RainbowSimple extends DynamicEffect {
  onMount() {
    Main.strips?.default.map(
      (position, length, _value) => new CHSV((position / length) * 360, 1, 1)
    );
  }

  draw() {
    Main.strips?.default.shift(1);
  }
}
