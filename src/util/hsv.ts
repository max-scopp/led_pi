import { PixelColor } from "./color";
import { CRGB } from "./rgb";

export class CHSV implements PixelColor {
  constructor(
    public h: number,
    public s: number,

    /**
     * aka. brightness
     */
    public v: number
  ) {}

  clone() {
    return new CHSV(this.h, this.s, this.v);
  }

  toRGB() {
    return CRGB.from_hsv(this);
  }

  toPixel(): number {
    return this.toRGB().toPixel();
  }
}
