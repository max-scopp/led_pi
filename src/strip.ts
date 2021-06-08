import Decimal from "decimal.js";
import Effects from "effects";
import { throttle } from "throttle-debounce";
import { fillWithPattern, rotateLeft, rotateRight } from "util/array";
import { ColorBase } from "util/color-base";
import { print } from "util/print";
import ws281x from "ws281x-pi4";

import { NUM_LEDS } from "./constants.json";
import { Color, colorFraction } from "./util/color";
import { Effect } from "./util/effect";

export class Strip {
  private readonly leds = new Uint32Array(NUM_LEDS);

  private _activeEffect: Effect | undefined;
  private effectLoopId: number | undefined;

  private _frameCounter = 0;
  private _frameCountStart = Date.now();

  private _lastRender = 0;
  private _lastFrameTime = 0;

  private _fps = 0;

  // -1 means queue the next frame right after the render finished
  private targetFps = -1;

  private printFPS = throttle(100, () => {
    const str = `FPS: ${this.fps.toFixed(3)}\tFT: ${this._lastFrameTime.toFixed(
      3
    )}ms`;

    const line = new Array(34).fill(" ").map((v, i) => str[i] || v);

    print(`${line.join("")}\r`);
  });

  get fps() {
    return this._fps;
  }

  constructor(opts?: ws281x.Configuration) {
    if (opts) ws281x.configure(opts);
    this.tick();

    (global as any).strip = this;
    (global as any).Effectts = Effects;
  }

  private tick() {
    const next = () => setImmediate(() => this.tick());

    const baseOneFrameTime = 1000 / this.targetFps;
    let nextExpectedTime;

    if (this._activeEffect) {
      const hasCustomFps = this._activeEffect.FRAMES_PER_SECOND !== 0;

      const oneFrameTime = hasCustomFps
        ? 1000 / this._activeEffect.FRAMES_PER_SECOND
        : baseOneFrameTime;

      nextExpectedTime = this._lastRender - 1 + oneFrameTime;
    } else {
      nextExpectedTime = this._lastRender - 1 + baseOneFrameTime;
    }

    if (Date.now() >= nextExpectedTime) {
      if (this._activeEffect) {
        this._activeEffect.draw();
      }

      this.render();

      this._lastFrameTime = Date.now() - this._lastRender;
      this._lastRender = Date.now();
    }

    next();
  }

  private render() {
    this._frameCounter++;

    ws281x.render(this.leds);

    this.printFPS();

    const timeSince = Date.now() - this._frameCountStart;
    this._fps = (this._frameCounter / timeSince) * 1e3;

    if (this._frameCounter > 10) {
      this._frameCounter = this._frameCounter / 2;
      this._frameCountStart =
        this._frameCountStart + (Date.now() - this._frameCountStart) / 2;
    }
  }

  map(callback: (position: number, length: number, value: number) => Color) {
    const ledLength = this.leds.length;

    for (let i = 0; i < ledLength; i++) {
      this.leds[i] = Number(callback(i, ledLength, this.leds[i]));
    }
  }

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
    const decim = new Decimal(fPos);

    const availableFirstPixel = new Decimal(1).minus(
      decim.minus(Decimal.trunc(fPos))
    );

    const amtFirstPixel = Decimal.min(availableFirstPixel, count);

    let remaining = Decimal.min(count, NUM_LEDS - fPos);
    let iPos = Math.trunc(fPos);

    if (remaining.greaterThan(0)) {
      this.leds[iPos++] = Number(colorFraction(color, amtFirstPixel));
      remaining = remaining.minus(amtFirstPixel);
    }

    while (remaining.greaterThan(1)) {
      this.leds[iPos++] = Number(color);
      remaining = remaining.minus(1);
    }

    if (remaining.greaterThan(0)) {
      this.leds[iPos] = Number(colorFraction(color, remaining));
    }
  }

  clear() {
    this.fill(0);
  }

  // @Measure(print, "shift")
  shift(offsetBy = 1) {
    if (offsetBy > 0) {
      rotateRight(this.leds, offsetBy);
      return;
    }

    rotateLeft(this.leds, Math.abs(offsetBy));
  }

  fill(color: Color) {
    this.leds.fill(Number(color));
  }

  fillPattern(pattern: Color[]) {
    fillWithPattern(
      this.leds,
      pattern.map((color) => Number(color))
    );
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
