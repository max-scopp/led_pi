
import tinycolor from "tinycolor2";

import { ColorBase } from "./color-base";
import { EasingFunctions } from "../common/easings";
import { CHSV } from "./hsv";
import { CRGB } from "./rgb";

export type Color = number | ColorBase;

export function colorFraction(color: ColorBase, fraction: number) {
  const frac = Math.min(1, fraction);
  const byFrac = 1 - frac;
  const newC = color
    .clone()
    .fadeToBlackBy(EasingFunctions.Sinusoidal.In(byFrac));

  return newC;
}

export function colorFromString(color: string): CHSV {
  const inst = tinycolor(color);
  const { h, s, v } = inst.toHsv();

  return new CHSV(h, s, v);
}

/**
 *
 * @param colorA
 * @param colorB
 * @param amount 0 - 100, where 0 is more from `colorA` than `colorB`
 * @returns
 */
export function blendColor(
  colorA: CRGB | CHSV,
  colorB: CRGB | CHSV,
  amount: number = 50
) {
  const { r, g, b, a } = tinycolor.mix(colorA, colorB, amount).toRgb();
  return new CRGB(r, g, b, a);
}
