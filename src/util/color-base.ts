import Decimal from "decimal.js";
import { createLogger } from "./logger";
import { Measure } from "./measure";

const log = createLogger("color");

export abstract class ColorBase {
  abstract clone(): ColorBase;
  abstract toPixel(): number;

  abstract fadeToBlackBy(fraction: Decimal.Value): ColorBase;

  // @Measure(log, "[Symbol.toPrimitive]")
  [Symbol.toPrimitive](_hint: TypeOfTypes) {
    return this.toPixel();
  }
}
