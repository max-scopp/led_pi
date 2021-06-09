import debug from "debug";

import pkg from "../../package.json";

export function createLogger(ns: string) {
  const _debugger = debug(`${pkg.name}:${ns}`);
  return _debugger;
}
