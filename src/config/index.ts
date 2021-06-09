import { AudioStorage } from "./audio";
import { LedStorage } from "./led";
import { PresetStorage } from "./presets";
import { WebStorage } from "./web";

const audio = new AudioStorage();
const led = new LedStorage();
const web = new WebStorage();
const presets = new PresetStorage();

const Config = {
  audio,
  led,
  web,
  presets,
  async init() {
    return Promise.all([audio.init(), led.init(), web.init(), presets.init()]);
  },
};

export default Config;
