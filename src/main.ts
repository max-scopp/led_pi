import { initAudio } from "audio/capture";
import Effects from "effects";
import ws281x from "ws281x-pi4";

import { GPIO_PIN, NUM_LEDS, STRIP_TYPE } from "./constants.json";
import { Strip } from "./strip";
import { blendColor, colorFromString } from "./util/color";
import { print } from "./util/print";
import { createWebService } from "./web/main";

export class Main {
  private static didSetup = false;

  static strip = new Strip({
    leds: NUM_LEDS,
    stripType: STRIP_TYPE as ws281x.StripType,
    gpio: GPIO_PIN,
  });
  static iteration = -1;

  static exit(exitCode: number) {
    this.strip.fill(colorFromString("magenta"));

    this.cleanup(exitCode);
  }

  static cleanup(exitCode: number) {
    process.exit(exitCode);
  }

  static setup() {
    if (this.didSetup) {
      throw new Error("Setup already ran.");
    }

    this.didSetup = true;

    print("Setup...");

    const boundExit = this.exit.bind(this);

    [
      "exit",
      "SIGHUP",
      "SIGINT",
      "SIGQUIT",
      "SIGILL",
      "SIGTRAP",
      "SIGABRT",
      "SIGBUS",
      "SIGFPE",
      "SIGUSR1",
      "SIGSEGV",
      "SIGUSR2",
      "SIGTERM",
    ].forEach((sig: string) => {
      process.on(sig, boundExit);
    });

    print("Initialize web service...");
    createWebService();

    this.strip.fill(colorFromString("tomato"));

    print("Initialize Audio ...");
    initAudio();

    // print("Running...");
    // setInterval(this.changeColor.bind(this), 1e3);
    this.strip.setEffect(Effects.Marquee);
  }
}

Main.setup();
