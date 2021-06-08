import Decimal from "decimal.js";
import { Main } from "main";
import { Effect } from "util/effect";
import { CHSV } from "util/hsv";
import { print } from "util/print";

export class RainbowFancy implements Effect {
  FRAMES_PER_SECOND = 60;

  initialHue = new Decimal(0);
  deltaHue = 0.5;
  hueDensity = 1;

  draw() {
    if (this.initialHue.greaterThan(360)) {
      this.initialHue = this.initialHue.minus(360);
    } else {
      this.initialHue = this.initialHue.add(this.deltaHue);
    }

    Main.strip.map((position, count) => {
      const stepHue = Number(this.initialHue) + this.hueDensity * position;

      return new CHSV(Math.round(stepHue % 360), 1, 1);
    });
  }
}
