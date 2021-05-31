import { Effect } from "util/effect";

export class Rainbow implements Effect {
  fps = 0;
  initialHue = 0;
  deltaHue = 16;
  hueDensity = 4;

  loop() {}
}
