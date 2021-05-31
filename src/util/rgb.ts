import tinycolor from "tinycolor2";
import { PixelColor } from "./color";
import { CHSV } from "./hsv";
import { createLogger } from "./logger";
import { Measure } from "./measure";

const log = createLogger("color:rgb");

export class CRGB implements PixelColor {
  constructor(
    public r: number,
    public g: number,
    public b: number,

    /**
     * Value from 0-1
     */
    public a?: number
  ) {}

  clone() {
    return new CRGB(this.r, this.g, this.b);
  }

  @Measure(log, "from_hsv")
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
