import { Preset } from "config/presets";

export class ListEffectsCommand implements WorkerMessage {
  readonly type = "getEffects";

  constructor() {}
}

export class ListEffectsResponse implements WorkerMessage {
  readonly type = "effectsList";

  constructor(readonly effects: string[]) {}
}

export class SetEffectCommand implements WorkerMessage {
  readonly type = "setEffect";

  constructor(readonly effect: string, readonly preset?: Preset) {}
}

export class SetColorCommand implements WorkerMessage {
  readonly type = "setColor";

  constructor(readonly color: string) {}
}

export class SetBrightnessCommand implements WorkerMessage {
  readonly type = "setBrightness";

  constructor(readonly brightness: number, readonly smooth?: boolean) {}
}

export type LedCommands =
  | ListEffectsCommand
  | ListEffectsResponse
  | SetEffectCommand
  | SetColorCommand
  | SetBrightnessCommand;
