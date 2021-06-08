import Decimal from "decimal.js";
import { Main } from "main";
import { CWheel } from "util/color-wheel";
import { Effect } from "util/effect";

import { NUM_LEDS } from "../constants.json";

export class Marquee implements Effect {
  FRAMES_PER_SECOND = 60;

  scroll = new Decimal(0);

  draw() {
    this.scroll = this.scroll.add(0.02);

    if (this.scroll.greaterThan(5)) {
      this.scroll = this.scroll.minus(5);
    }

    for (let i = this.scroll.toNumber(); i < NUM_LEDS - 1; i += 5) {
      Main.strip.drawPixels(i, 1, CWheel.Green);
    }
  }
}
