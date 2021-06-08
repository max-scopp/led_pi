import { Decimal } from "decimal.js";
import tinycolor from "tinycolor2";

import { ColorBase } from "./color-base";
import { CHSV } from "./hsv";

/**
 * base colors from https://www.usability.gov/sites/default/files/images/color-wheel.png
 */
export class CRGB extends ColorBase {
  constructor(
    /**
     * 0-255, red
     */
    public r: number,

    /**
     * 0-255, green
     */
    public g: number,

    /**
     * 0-255, blue
     */
    public b: number,

    /**
     * 0-1, alpha, similiar to CHSV.v
     */
    public a: number = 1
  ) {
    super();
  }

  fadeToBlackBy(fraction: Decimal.Value) {
    const result = new Decimal(this.a).minus(fraction);

    if (result.greaterThanOrEqualTo(0)) {
      this.a = result.toNumber();
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
