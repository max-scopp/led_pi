import { LocalStorage } from "common/local-storage";

interface WebConfiguration {
  ENABLE: boolean;
  HOST: string;
  PORT: number;
}

export class WebStorage extends LocalStorage<WebConfiguration> {
  protected _data = <WebConfiguration>{
    ENABLE: false,
    HOST: "0.0.0.0",
    PORT: 3000,
  };

  constructor() {
    super("web.json");
  }
}
