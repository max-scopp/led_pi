import tinycolor from "tinycolor2";

import { ColorBase } from "./color-base";
import { CHSV } from "./hsv";

export class CRGB extends ColorBase {
  static Red = new CRGB(255, 0, 0);
  static Green = new CRGB(0, 255, 0);
  static Blue = new CRGB(0, 0, 255);

  constructor(
    public r: number,
    public g: number,
    public b: number,

    /**
     * Value from 0-1
     */
    public a: number = 1
  ) {
    super();
  }

  fadeToBlackBy(fraction: number) {
    const result = this.a - fraction;

    if (result >= 0) {
      this.a = result;
    } else {
      this.a = 0;
    }

    return this;
  }

  clone() {
    return new CRGB(this.r, this.g, this.b);
  }

  static from_hsv(hsv: CHSV): CRGB {
    const { h: h, s: s, v: v } = hsv;

    const { r, g, b, a } = tinycolor.fromRatio({ h, s, v }).toRgb();

    return new CRGB(r, g, b, a);
  }

  toPixel(): number {
    if (this.a !== undefined) {
      return (
        ((this.r * this.a) << 16) | ((this.g * this.a) << 8) | (this.b * this.a)
      );
    }

    return (this.r << 16) | (this.g << 8) | this.b;
  }
}
