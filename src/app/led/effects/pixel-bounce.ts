import Decimal from "decimal.js";
import { Main } from "main";
import { blendColor } from "core/color";
import { CWheel } from "core/color-wheel";
import { EasingFunctions } from "common/easings";
import { DynamicEffect } from "common/effect";

export class PixelBounce extends DynamicEffect {
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

    if (this.offset.greaterThan(Main.strip.length - 1)) {
      this.backMode = true;
    }

    if (this.offset.lessThanOrEqualTo(this.barLength)) {
      this.backMode = false;
    }

    const percentageFloat = this.offset.dividedBy(Main.strip.length).toNumber();

    const scale = EasingFunctions.Cubic.In(percentageFloat);

    const scaled = (Main.strip.length - this.barLength) * scale;

    Main.strip.clear();
    Main.strip.drawPixels(
      scaled,
      this.backMode
        ? blendColor(CWheel.Yellow, CWheel.BlueViolet, percentageFloat * 100)
        : CWheel.Yellow,
      this.barLength
    );
  }
}
