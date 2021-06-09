import { LocalStorage } from "common/local-storage";

interface AudioConfiguration {
  DEFAULT_DEVICE_ID: number;
}

export class AudioStorage extends LocalStorage<AudioConfiguration> {
  protected _data = <AudioConfiguration>{};

  constructor() {
    super("audio.json");
  }
}
