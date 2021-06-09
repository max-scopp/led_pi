import { NestFastifyApplication } from "@nestjs/platform-fastify";
import { Analyzer } from "audio/analyzer";
import { initAudio } from "audio/capture";
import Config from "config";
import { createLogger } from "util/logger";
import ws281x from "ws281x-pi4";
import { Strip } from "./strip";
import { colorFromString } from "./util/color";
import { initWebService } from "./web/main";

const log = createLogger("main");

export class Main {
  private static didSetup = false;

  static strip: Strip;

  static analyzer: Analyzer;

  static web: NestFastifyApplication | undefined;

  static exit(exitCode: number) {
    if (this.strip) {
      this.strip.fill(colorFromString("magenta"));
    }

    this.cleanup(exitCode);
  }

  static cleanup(exitCode: number) {
    process.exit(exitCode);
  }

  static async setup() {
    if (this.didSetup) {
      throw new Error("Setup already ran.");
    }

    this.didSetup = true;

    log("Setup...");

    const boundExit = this.exit.bind(this);

    [
      "exit",
      "SIGHUP",
      "SIGINT",
      "SIGQUIT",
      "SIGILL",
      "SIGTRAP",
      "SIGTERM",
    ].forEach((sig: string) => {
      process.on(sig, boundExit);
    });

    log("Initialize Config ...");
    await Config.init();

    log("Initialize LED Strip(s) ...");

    this.strip = new Strip({
      leds: <number>Config.led.getItem("NUM_LEDS"),
      gpio: <number>Config.led.getItem("GPIO_PIN"),
      stripType: <ws281x.StripType>Config.led.getItem("STRIP_TYPE"),
    });

    log("Initialize Audio ...");
    this.analyzer = await initAudio();

    log("Initialize web service...");
    this.web = await initWebService();

    if (process.env.NODE_ENV === "development") {
      (global as any)["Main"] = this;
    }
  }
}

Main.setup();
