import tinycolor from "tinycolor2";
import { CHSV } from "./hsv";
import { CRGB } from "./rgb";

export interface PixelColor {
  clone(): PixelColor;
  toPixel(): number;
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
