import { fillWithPattern, rotateLeft, rotateRight } from "util/array";
import { ColorBase } from "util/color-base";
import ws281x from "ws281x-pi4";

import { NUM_LEDS } from "./constants.json";
import { Color, colorFraction } from "./util/color";
import { Effect } from "./util/effect";

export enum Direction {
  Left,
  Right,
}

export class Strip {
  private readonly leds = new Uint32Array(NUM_LEDS);

  private _activeEffect: Effect | undefined;
  private effectLoopId: number | undefined;

  constructor(opts?: ws281x.Configuration) {
    if (opts) ws281x.configure(opts);
  }

  render = () => {
    ws281x.render(this.leds);
  };

  setPixel(position: number, pixel: Color) {
    this.leds[position] = Number(pixel);
  }

  /**
   * TODO: Make compatible with Color (numbers)
   * @param fPos
   * @param count
   * @param color
   */
  drawPixels(fPos: number, count: number, color: ColorBase) {
    // calc how much the first pixel will hold
    const availableFirstPixel = 1 - (Math.trunc(fPos) - fPos);
    const amtFirstPixel = Math.min(availableFirstPixel, count);

    let remaining = Math.min(count, NUM_LEDS - fPos);
    let iPos = fPos;

    if (remaining > 0) {
      this.leds[iPos++] += Number(colorFraction(color, amtFirstPixel));
      remaining -= amtFirstPixel;
    }

    while (remaining > 1) {
      this.leds[iPos++] += Number(color);
      remaining--;
    }

    if (remaining > 0) {
      this.leds[iPos] += Number(colorFraction(color, remaining));
    }
  }

  clear() {
    this.fill(0);
  }

  shift(offsetBy = 1, direction?: Direction) {
    switch (direction) {
      case Direction.Right:
        rotateRight(this.leds, offsetBy);
        break;

      default:
      case Direction.Left:
        rotateLeft(this.leds, offsetBy);
    }

    this.render();
  }

  fill(color: Color) {
    this.leds.fill(Number(color));

    this.render();
  }

  fillPattern(pattern: Color[]) {
    fillWithPattern(this.leds, pattern);

    this.render();
  }

  private tick() {
    if (this._activeEffect) {
      this._activeEffect.loop();
    }

    this.render();
  }

  setEffect(effect: { new (): Effect }) {
    this.clear();

    this._activeEffect = new effect();
  }

  clearEffect() {
    clearInterval(this.effectLoopId);
    this._activeEffect = undefined;
  }
}
