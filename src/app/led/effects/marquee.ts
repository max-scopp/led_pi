import Decimal from "decimal.js";
import { Main } from "main";
import { CWheel } from "core/color-wheel";
import { DynamicEffect } from "common/effect";

export class Marquee extends DynamicEffect {
  FRAMES_PER_SECOND = 60;

  scroll = new Decimal(0);

  draw() {
    this.scroll = this.scroll.add(0.02);

    if (this.scroll.greaterThan(5)) {
      this.scroll = this.scroll.minus(5);
    }

    for (let i = this.scroll.toNumber(); i < Main.strip.length - 1; i += 5) {
      Main.strip.drawPixels(i, CWheel.Green, 3);
    }
  }
}
