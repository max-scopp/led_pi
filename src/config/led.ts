import { LocalStorage } from "common/local-storage";
import { StripType } from "@max.scopp/ws281x-pi";

interface LedConfiguration {
  NUM_LEDS: number;
  GPIO_PIN: number;
  STRIP_TYPE: StripType;
  BRIGHTNESS: number;
}

export class LedStorage extends LocalStorage<LedConfiguration> {
  protected _data = <LedConfiguration>{
    NUM_LEDS: 60,
    GPIO_PIN: 18,
    STRIP_TYPE: "grb",
    BRIGHTNESS: 255,
  };

  constructor() {
    super("led.json");
  }
}
