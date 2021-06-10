import Config from "config";
import { Preset, PresetCollection } from "config/presets";
import Decimal from "decimal.js";
import Effects from "app/led/effects";
import { throttle } from "throttle-debounce";
import { fillWithPattern, rotateLeft, rotateRight } from "util/array";
import { ColorBase } from "core/color-base";
import { fps } from "util/fps";
import { print } from "util/print";
import ws281x from "ws281x-pi4";
import { MS_PER_SECOND } from "../../constants";
import { Color, colorFraction } from "../../core/color";
import { Effect } from "../../common/effect";

const META_MOUNT = "EFF_DID_MOUNT";

export interface OneDStrip extends ws281x.Configuration {
  leds: number;
}

export interface MatrixStrip extends ws281x.Configuration {
  width: number;
  height: number;
}

export class Strip {
  private readonly leds = new Uint32Array(this._opts.leds);
  private readonly _drawSince = Date.now();

  private _activeEffect: Effect | undefined;
  private _effectLoopId: number | undefined;

  /**
   * Date.now() of the last render() call
   */
  private _lastRender = 0;

  /**
   * Time spent in tick()
   */
  private _lastFrameTime = 0;

  // -1 means queue the next frame right after the render finished
  private DEFAULT_FRAMES_PER_SECOND = 60;
  private _fps = 0;
  private _fpsHistory = new Array(500).fill(0);

  private printFPS = throttle(60, () => {
    const str = `\tfps\t${this.fps} \tfps(avg)\t${this.fpsAverage} \tft(ms)\t${this._lastFrameTime}`;

    const line = new Array(34).fill(" ").map((v, i) => str[i] || v);

    print(`${line.join("")}\r`);
  });

  get fps() {
    return this._fps;
  }

  get fpsAverage() {
    let total = 0;
    for (let i = 0; i < this._fpsHistory.length; i++) {
      total += this._fpsHistory[i];
    }

    return Math.trunc(total / this._fpsHistory.length);
  }

  get length() {
    return this.leds.length;
  }

  constructor(readonly _opts: OneDStrip | MatrixStrip) {
    ws281x.configure(_opts);

    this.tick();

    const startupEffect = <string>Config.presets.getItem("STARTUP_PRESET");

    if (startupEffect) {
      this.activatePreset(startupEffect);
    }
  }

  private render() {
    ws281x.render(this.leds);

    this.printFPS();
  }

  private tick = () => {
    const tickStart = Date.now();

    const targetFt =
      MS_PER_SECOND /
      (this._activeEffect?.FRAMES_PER_SECOND || this.DEFAULT_FRAMES_PER_SECOND);

    const nextRenderAt = this._lastRender + targetFt - this._lastFrameTime;

    if (tickStart >= nextRenderAt) {
      if (this._activeEffect) {
        const didMount = Reflect.getMetadata(META_MOUNT, this._activeEffect);

        if (!didMount) {
          if (this._activeEffect.onMount) {
            this._activeEffect.onMount();
          }

          Reflect.defineMetadata(META_MOUNT, true, this._activeEffect);
        }

        this._activeEffect.draw(tickStart - this._drawSince);
      }

      this.render();

      const now = Date.now();

      this._fps = fps(this._lastRender, now);
      this._fpsHistory.push(this._fps);
      this._fpsHistory.shift();

      this._lastRender = tickStart;
      this._lastFrameTime = now - tickStart;
    }

    setTimeout(this.tick);
  };

  /**
   * Adjust the brightness of the final led's.
   * May impact performance.
   * @param brightness 0-255
   */
  brightness(brightness: number) {
    throw new Error("Not supported (yet)");
  }

  map(callback: (position: number, length: number, value: number) => Color) {
    const ledLength = this.leds.length;

    for (let i = 0; i < ledLength; i++) {
      this.leds[i] = Number(callback(i, ledLength, this.leds[i]));
    }
  }

  /**
   * Set's pixel forcefully using an integer
   * @param position
   * @param pixel
   */
  setPixel(position: number, pixel: Color) {
    this.leds[position] = Number(pixel);
  }

  /**
   * Using a floating index and a floating count, set one, or multiple pixels,
   * even if they overlap partially accordingly to the correct brightness and underlying color.
   * @param fPos
   * @param count
   * @param color
   */
  drawPixels(fPos: number, color: ColorBase, count: number = 1) {
    // calc how much the first pixel will hold
    const decim = new Decimal(fPos);

    const availableFirstPixel = new Decimal(1).minus(
      decim.minus(Decimal.trunc(fPos))
    );

    const amtFirstPixel = Decimal.min(availableFirstPixel, count);

    let remaining = Decimal.min(count, <number>this._opts.leds - fPos);
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

  clearEffect() {
    clearInterval(this._effectLoopId);

    if (this._activeEffect?.onUnmount) {
      this._activeEffect?.onUnmount();
    }

    this._activeEffect = undefined;
    this.clear();
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
    this._activeEffect = new effect();
  }

  activatePreset(presetName: string) {
    const presets = <PresetCollection>Config.presets.getItem("EFFECTS");

    if (!presets[presetName]) {
      throw new Error(
        `Preset "${presetName}" was not found in presets. Inspect presets.json!`
      );
    }

    const targetPreset = presets[presetName];

    this.setEffect(Effects[targetPreset.name]);
    Object.assign(this._activeEffect, targetPreset.configuration);
  }
}
