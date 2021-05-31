import debug from "debug";

export function createLogger(ns: string) {
  const _debugger = debug(ns);

  _debugger.log = console.log.bind(console);

  return _debugger;
}
