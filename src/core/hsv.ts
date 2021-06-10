import Decimal from "decimal.js";
import { ColorBase } from "./color-base";
import { CRGB } from "./rgb";

export class CHSV extends ColorBase {
  constructor(
    /**
     * 0-360 hue
     */
    public h: number,

    /**
     * 0-1, saturation where 1 is color and 0 is white
     */
    public s: number,

    /**
     * 0-1, value aka. brightness
     */
    public v: number
  ) {
    super();
  }

  fadeToBlackBy(fraction: Decimal.Value) {
    const result = new Decimal(this.v).minus(fraction);

    if (result.lessThanOrEqualTo(0)) {
      this.v = result.toNumber();
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
