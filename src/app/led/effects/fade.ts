import { EasingFunctions } from "common/easings";
import { DynamicEffect } from "common/effect";
import { blendColor } from "core/color";
import { CWheel } from "core/color-wheel";
import { Main } from "main";
import { MS_PER_SECOND } from "../../../constants";

export class Fade extends DynamicEffect {
  FRAMES_PER_SECOND = -1;

  colors = [CWheel.Red, CWheel.Green, CWheel.Blue];

  offset = 0;
  speed = 1;

  easing = EasingFunctions.Sinusoidal.InOut;

  draw(t: number) {
    const tPos = t / (this.speed * MS_PER_SECOND);
    const fPos = tPos % this.colors.length;

    const prevC = Math.floor(fPos);
    const nextC = Math.ceil(fPos) % this.colors.length; // if we're at the end, the module will handle the edge case, too

    const fMix = this.easing(fPos - Math.trunc(fPos));

    const c = blendColor(this.colors[prevC], this.colors[nextC], fMix * 100);

    Main.strip.fill(c);
  }
}
