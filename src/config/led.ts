import { LocalStorage } from "common/local-storage";
import ws281x from "ws281x-pi4";

interface LedConfiguration {
  NUM_LEDS: number;
  GPIO_PIN: number;
  STRIP_TYPE: ws281x.StripType;
}

export class LedStorage extends LocalStorage<LedConfiguration> {
  protected _data = <LedConfiguration>{
    NUM_LEDS: 60,
    GPIO_PIN: 18,
    STRIP_TYPE: "grb",
  };

  constructor() {
    super("led.json");
  }
}
