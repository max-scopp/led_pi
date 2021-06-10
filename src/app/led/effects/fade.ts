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
  speed = MS_PER_SECOND * 2;

  easing = EasingFunctions.Sinusoidal.InOut;

  draw(t: number) {
    const tPos = t / this.speed;
    const fPos = this.easing(tPos % this.colors.length);

    const bC = Math.floor(fPos);
    const tC = Math.ceil(fPos) % this.colors.length; // if we're at the end, the module will handle the edge case, too

    const fMix = (fPos - Math.trunc(fPos)) * 100;

    const c = blendColor(this.colors[bC], this.colors[tC], fMix);

    Main.strip.fill(c);
  }
}
