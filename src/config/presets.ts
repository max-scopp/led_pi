import { LocalStorage } from "common/local-storage";
import { RainbowFancy } from "app/led/effects/rainbow-fancy";
import { Effect } from "common/effect";
import { Fade } from "app/led/effects/fade";
import { CRGB } from "core/rgb";

export type Preset<T extends Effect = any> = Omit<
  T,
  "FRAMES_PER_SECOND" | "onMount" | "onUnmount" | "draw"
>;

export type PresetEntry = {
  name: string;
  configuration: Preset;
};

export type PresetCollection = {
  [key: string]: PresetEntry;
};

interface PresetConfiguration {
  STARTUP_PRESET: keyof PresetConfiguration["EFFECTS"];
  EFFECTS: PresetCollection;
}

export class PresetStorage extends LocalStorage<PresetConfiguration> {
  protected _data = <PresetConfiguration>{
    STARTUP_PRESET: "default-startup",
    EFFECTS: {
      ["default-startup"]: {
        name: RainbowFancy.name,
        configuration: {
          speed: 15,
          hueDensity: 5,
        },
      },
      ["gamer-fade"]: {
        name: Fade.name,
        configuration: {
          speed: 5,
          colors: [new CRGB(0, 255, 255), new CRGB(255, 0, 255)],
        },
      },
    },
  };

  constructor() {
    super("presets.json");
  }
}
