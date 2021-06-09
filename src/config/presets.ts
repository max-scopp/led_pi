import { LocalStorage } from "common/local-storage";
import { RainbowFancy } from "effects/rainbow-fancy";
import { Effect } from "util/effect";

export type Preset<T extends Effect = any> = Omit<
  T,
  "FRAMES_PER_SECOND" | "onMount" | "onUnmount" | "draw"
>;

<<<<<<< HEAD
export type PresetEntry = {
  name: string;
  configuration: Preset;
=======
export type PresetEntry<T = any> = {
  name: string;
  configuration: Preset<T>;
>>>>>>> e97a5ec16bc9f4b6f15cf7d0c584be90328e004b
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
    },
  };

  constructor() {
    super("presets.json");
  }
}
