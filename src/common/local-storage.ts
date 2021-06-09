import { R_OK, W_OK } from "constants";
import { promises as fs } from "fs";
import { resolve } from "path";

export class LocalStorage<T extends AnyObject> {
  protected _data: T = {} as T;
  protected _dataLoaded = false;

  constructor(protected readonly _filePath: string) {}

  getItem(key: keyof T) {
    if (!this._dataLoaded) {
      this._dataLoaded = true;
    }

    return this._data[key];
  }

  setItem<K extends keyof T>(key: K, value: T[K]) {
    this._data[key] = value;
    setTimeout(this.store);
  }

  has(key: string): boolean {
    return Boolean(this._data[key]);
  }

  all() {
    return { ...this._data };
  }

  private get _writePath() {
    return resolve(__dirname, "../../", this._filePath);
  }

  async init() {
    try {
      await fs.access(this._writePath, R_OK & W_OK);
    } catch (e) {
      await this.store();
    }

    const fileStr = await fs.readFile(this._writePath);
    const fileParsed = JSON.parse(String(fileStr || {}));

    this._data = {
      ...this._data,
      ...fileParsed,
    };

    return true;
  }

  store = async () => {
    const prettyJson = JSON.stringify(this._data, null, 2);
    return await fs.writeFile(this._writePath, prettyJson);
  };
}
