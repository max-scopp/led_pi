import Decimal from "decimal.js";
import { Main } from "main";
import { blendColor } from "util/color";
import { CWheel } from "util/color-wheel";
import { EasingFunctions } from "util/easings";
import { Effect } from "util/effect";

import { NUM_LEDS } from "../constants.json";

export class PixelBounce implements Effect {
  FRAMES_PER_SECOND = 60;

  barLength = 3;

  offset = new Decimal(0);

  backMode = false;

  draw() {
    if (this.backMode) {
      this.offset = this.offset.sub(0.3);
    } else {
      this.offset = this.offset.add(0.3);
    }

    if (this.offset.greaterThan(NUM_LEDS - 1)) {
      this.backMode = true;
    }

    if (this.offset.lessThanOrEqualTo(this.barLength)) {
      this.backMode = false;
    }

    const percentageFloat = this.offset.dividedBy(NUM_LEDS).toNumber();

    const scale = EasingFunctions.Cubic.In(percentageFloat);

    const scaled = (NUM_LEDS - this.barLength) * scale;

    Main.strip.clear();
    Main.strip.drawPixels(
      scaled,
      this.barLength,
      this.backMode
        ? blendColor(CWheel.Yellow, CWheel.BlueViolet, percentageFloat * 100)
        : CWheel.Yellow
    );
  }
}
