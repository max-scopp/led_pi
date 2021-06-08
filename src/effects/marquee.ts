import { Main } from "main";
import { Effect } from "util/effect";
import { CRGB } from "util/rgb";
import { NUM_LEDS } from "../constants.json";

export class Marquee implements Effect {
  scroll = 0;
  static scrollBy = 0.1;

  loop() {
    if (this.scroll > 5) {
      this.scroll -= 5;
    }

    for (let i = this.scroll; i < NUM_LEDS - 1; i += 5) {
      Main.strip.drawPixels(i, 3, CRGB.Green);
    }
  }
}
