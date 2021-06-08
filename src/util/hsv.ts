import { ColorBase } from "./color-base";
import { CRGB } from "./rgb";

export class CHSV extends ColorBase {
  constructor(
    public h: number,
    public s: number,

    /**
     * aka. brightness
     */
    public v: number
  ) {
    super();
  }

  fadeToBlackBy(fraction: number) {
    const result = this.v - fraction;

    if (result >= 0) {
      this.v = result;
    } else {
      this.v = 0;
    }

    return this;
  }

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
