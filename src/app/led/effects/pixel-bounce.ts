
import { Main } from "main";
import { blendColor } from "core/color";
import { CWheel } from "core/color-wheel";
import { EasingFunctions } from "common/easings";
import { DynamicEffect } from "common/effect";

export class PixelBounce extends DynamicEffect {
  barLength = 3;

  offset = 0;

  backMode = false;

  draw() {
    const stripLength = Main.strips?.default.length || 0;

    if (this.backMode) {
      this.offset -= 0.3;
    } else {
      this.offset += 0.3;
    }

    if (this.offset > stripLength - 1) {
      this.backMode = true;
    }

    if (this.offset <= this.barLength) {
      this.backMode = false;
    }

    const percentageFloat = this.offset / stripLength;

    const scale = EasingFunctions.Cubic.In(percentageFloat);

    const scaled = (stripLength - this.barLength) * scale;

    Main.strips?.default.clear();
    Main.strips?.default.drawPixels(
      scaled,
      this.backMode
        ? blendColor(CWheel.Yellow, CWheel.BlueViolet, percentageFloat * 100)
        : CWheel.Yellow,
      this.barLength
    );
  }
}
