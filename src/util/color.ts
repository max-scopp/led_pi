import tinycolor from "tinycolor2";

import { ColorBase } from "./color-base";

import { CHSV } from "./hsv";
import { CRGB } from "./rgb";

export type Color = number | ColorBase;

export function colorFraction(color: ColorBase, fraction: number) {
  const frac = Math.min(1, fraction);

  return color.clone().fadeToBlackBy(1 - frac);
}

export function colorFromString(color: string): CHSV {
  const inst = tinycolor(color);
  const { h, s, v } = inst.toHsv();

  return new CHSV(h, s, v);
}

export function blendColor(colorA: CRGB | CHSV, colorB: CRGB | CHSV) {
  const { r, g, b, a } = tinycolor.mix(colorA, colorB).toRgb();
  return new CRGB(r, g, b, a);
}
