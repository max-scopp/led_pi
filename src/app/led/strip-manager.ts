import Config from "config";
import { StripType } from "@max.scopp/ws281x-pi";
import { Strip } from "./strip";

/**
 * This clas exists currently solely for future puposes.
 * Use `default` to get your primary led strip.
 */
export class StripManager {
  strips = new Map<string, Strip>();

  constructor() {
    const primaryStrip = new Strip({
      leds: <number>Config.led.getItem("NUM_LEDS"),
      gpio: <number>Config.led.getItem("GPIO_PIN"),
      stripType: <StripType>Config.led.getItem("STRIP_TYPE"),
      brightness: <number>Config.led.getItem("BRIGHTNESS"),
    });
    this.strips.set("default", primaryStrip);
  }

  /**
   * Always returns the default led strip.
   * If there is no default strip, the manager initialization will fail.
   */
  get default() {
    return this.strips.get("default") as Strip;
  }
}
