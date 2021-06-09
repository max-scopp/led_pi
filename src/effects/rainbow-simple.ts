import { Main } from "main";
import { DynamicEffect } from "util/effect";
import { CHSV } from "util/hsv";

export class RainbowSimple implements DynamicEffect {
  FRAMES_PER_SECOND = 60;

  constructor() {
    Main.strip.map(
      (position, length, _value) => new CHSV((position / length) * 360, 1, 1)
    );
  }

  draw() {
    Main.strip.shift(1);
  }
}
