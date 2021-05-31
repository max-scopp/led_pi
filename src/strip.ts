import ws281x from "ws281x-pi4";
import { NUM_LEDS } from "./constants.json";
import { PixelColor } from "./util/color";
import { Effect } from "./util/effect";

export class Strip {
  readonly pixels = new Uint32Array(NUM_LEDS);

  constructor(opts?: ws281x.Configuration) {
    if (opts) ws281x.configure(opts);
  }

  render() {
    ws281x.render(this.pixels);
  }

  shift(offsetBy = 1) {
    // this.pixels

    this.render();
  }

  fill(color: PixelColor) {
    this.pixels.fill(color.toPixel());
    this.render();
  }

  setEffect(effect: { new (): Effect }) {}
}
