import Ws281x, { Configuration } from "@max.scopp/ws281x-pi";
import Effects from "app/led/effects";
import { Easing, EasingFunctions } from "common/easings";
import Config from "config";
import { Preset, PresetCollection } from "config/presets";
import { ColorBase } from "core/color-base";
import { performance } from "perf_hooks";
import { throttle } from "throttle-debounce";
import { fillWithPattern, rotateLeft, rotateRight } from "util/array";
import { fps } from "util/fps";
import { print } from "util/print";
import { Effect } from "../../common/effect";
import { MS_PER_SECOND } from "../../constants";
import { Color, colorFraction } from "../../core/color";

const META_MOUNT = "EFF_DID_MOUNT";

export interface OneDStrip extends Configuration {
  leds: number;
}

export interface MatrixStrip extends Configuration {
  width: number;
  height: number;
}

export class Strip extends Ws281x {
  private readonly leds;
  private readonly _drawSince = performance.now();

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
  private DEFAULT_FRAMES_PER_SECOND = 64;

  private _fps = 0;
  private _fpsHistory = new Array(500).fill(0);

  private paused: boolean = false;

  private printFPS = throttle(333, () => {
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
    return this.led_count;
  }

  constructor(options: OneDStrip | MatrixStrip) {
    super(options);

    this.leds = new Uint32Array(Number(this.led_count));

    const startupEffect = <string>Config.presets.getItem("STARTUP_PRESET");

    if (startupEffect) {
      this.activatePreset(startupEffect);
    }

    // class initialized, run the rest lazily.
    setTimeout(() => {
      this.startup();
      this.tick();
    });
  }

  render() {
    super.render(this.leds);

    this.printFPS();
  }

  private tick = () => {
    if (this.paused) {
      return;
    }

    const tickStart = performance.now();

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

      const now = performance.now();

      this._fps = fps(this._lastRender, now);
      this._fpsHistory.push(this._fps);
      this._fpsHistory.shift();

      this._lastRender = tickStart;
      this._lastFrameTime = now - tickStart;
    }

    setImmediate(this.tick);
  };

  continue() {
    this.paused = false;
    this.tick();
  }

  pause() {
    this.paused = true;
  }

  adjustBrightnessSmooth(
    target: number,
    inMs: number = 400,
    easing: Easing = EasingFunctions.Quartic.Out
  ) {
    const old_brightness = this.brightness;

    // change large the change is from the current to the new brightness
    const range = target - old_brightness;

    // track progress from 0-1
    let progress = 0;

    // how many ms to sleep
    const changePer = 30;

    // how much change will occour in the time we slept
    const step_per_iteration = changePer / inMs;

    const interval = setInterval(() => {
      progress += step_per_iteration;

      // in some cases, it's possible to slightly overshoot
      // due to the way floats work.
      if(progress >= 1) {
        clearInterval(interval);
        progress = 1
      }

      // calculate the change, including the easing
      const meanwhile = range * easing(progress);

      // apply the change on top of the old brightness
      const intermediate_brightness = old_brightness + meanwhile;

      // apply
      this.setBrightness(intermediate_brightness);

      // check if we hit the target value prematurely,
      // if so, no need to progress further.
      
      if(intermediate_brightness === target) {
        clearInterval(interval);
      }
    }, changePer);
  }

  /**
   * Fades-out the strip into black and does some cleanup routines, if nessasairy.
   */
  shutdown() {
    this.adjustBrightnessSmooth(0);
  }

  /**
   * Fades in the strip from black.
   */
  startup() {
    const target = this.brightness;

    this.setBrightness(0);
    this.adjustBrightnessSmooth(target);
  }

  map(callback: (position: number, length: number, value: number) => Color) {
    const ledLength = this.length;

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
    const availableFirstPixel = 1.0 - fPos - Math.trunc(fPos);

    const amtFirstPixel = Math.min(availableFirstPixel, count);

    let remaining = Math.min(count, <number>this.options.leds - fPos);
    let iPos = Math.trunc(fPos);

    if (remaining > 0) {
      this.leds[iPos++] = Number(colorFraction(color, amtFirstPixel));
      remaining = remaining - amtFirstPixel;
    }

    while (remaining > 1) {
      this.leds[iPos++] = Number(color);
      remaining = remaining - 1;
    }

    if (remaining > 0) {
      this.leds[iPos] = Number(colorFraction(color, remaining));
    }
  }

  clear() {
    this.fill(0);
  }

  clearEffect() {
    clearInterval(this._effectLoopId as any);

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

  setEffect(effect: { new (): Effect }, configuration?: Preset) {
    this._activeEffect = new effect();

    if(configuration) {
          Object.assign(this._activeEffect, configuration);
    }

    Config.presets.storeAsLastPreset(this._activeEffect)
    
    return true;
  }

  activatePreset(presetName: string) {
    const presets = <PresetCollection>Config.presets.getItem("EFFECTS");

    if (!presets[presetName]) {
      throw new Error(
        `Preset "${presetName}" was not found in presets. Inspect presets.json!`
      );
    }

    const targetPreset = presets[presetName];

    this.setEffect(Effects[targetPreset.name], targetPreset.configuration);
  }
}
