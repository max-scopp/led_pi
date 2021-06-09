import { Main } from "main";
import { DynamicEffect } from "util/effect";
import { CHSV } from "util/hsv";

/**
 * The most basic rainbow effect possible.
 * Initializes by filling the strip with an rainbow,
 * then, each draw shifts the existing rainbow by 1.
 *
 * Use negative values to change the direction.
 */
export class RainbowSimple implements DynamicEffect {
  FRAMES_PER_SECOND = 10;

  onMount() {
    Main.strip.map(
      (position, length, _value) => new CHSV((position / length) * 360, 1, 1)
    );
  }

  constructor() {}

  draw() {
    Main.strip.shift(1);
  }
}
