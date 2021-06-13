import Effects from "app/led/effects";
import {
  ListEffectsResponse,
  SetBrightnessCommand,
  SetColorCommand,
  SetEffectCommand,
} from "app/led/led.commands";
import { colorFromString } from "core/color";
import { Main } from "main";

export const WebMessageExecutors = {
  getEffects() {
    Main.workers.postMessage(
      "web",
      new ListEffectsResponse(Object.keys(Effects))
    );
  },

  setEffect(command: SetEffectCommand) {
    const effectClass = Effects[command.effect];
    Main.strips?.default.setEffect(effectClass);
  },

  setColor(command: SetColorCommand) {
    Main.strips?.default.clearEffect();
    Main.strips?.default.fill(colorFromString(command.color));
  },

  setBrightness(command: SetBrightnessCommand) {
    Main.strips?.default.adjustBrightnessSmooth(
      command.brightness,
      command.smooth ? 1e+3 : 0
    );
  },
};
