import { LocalStorage } from "common/local-storage";
import { RainbowFancy } from "effects/rainbow-fancy";
import { Effect } from "util/effect";

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
          speed: 1,
          hueDensity: 10,
        },
      },
    },
  };

  constructor() {
    super("presets.json");
  }
}
