import { initAudio } from "app/audio";
import { Analyzer } from "app/audio/analyzer";
import { initStripManager } from "app/led";
import Effects from "app/led/effects";
import { LedCommands, ListEffectsResponse } from "app/led/led.commands";
import { StripManager } from "app/led/strip-manager";
import { EasingFunctions } from "common/easings";
import Config from "config";
import { createLogger } from "util/logger";
import { WebMessageExecutors } from "web-messages";
import { WorkerManager } from "workers";
import pkg from "../package.json";
import "./polyfill";

const log = createLogger("main");

export class Main {
  private static didSetup = false;

  static strips: StripManager | undefined;

  static analyzer: Analyzer | undefined;

  static workers: WorkerManager;

  static exit(exitCode: number) {
    log("Exiting...");

    if (this.strips) {
      const strip = this.strips.default;
      strip.shutdown();
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

    process.title = pkg.name;
    const boundExit = this.exit.bind(this);

    [
      "exit",
      "SIGHUP",
      "SIGINT",
      "SIGUSR1",
      "SIGUSR2",
      "SIGQUIT",
      "SIGILL",
      "SIGTRAP",
      "SIGTERM",
    ].forEach((sig: string) => {
      process.on(sig, boundExit);
    });

    log("Initialize WorkerManager ...");
    this.workers = new WorkerManager();

    log("Initialize Config ...");
    await Config.init();

    log("Initialize LEDs ...");
    this.strips = await initStripManager();

    log("Initialize Audio ...");
    this.analyzer = await initAudio();

    log("Initialize Web Service...");
    this.workers.addWorker(
      "web",
      "app/web/index.js",
      this.onWebMessage.bind(this)
    );

    if (process.env.NODE_ENV === "development") {
      (global as any)["Main"] = this;
      (global as any)["Effects"] = Effects;
      (global as any)["EasingFunctions"] = EasingFunctions;
      
      log('Exposed global vars for debug')
    }
  }

  static onWebMessage(command: LedCommands) {
    const executor = (WebMessageExecutors as any)[command.type];

    if (executor) {
      executor(command);
    }
  }
}

Main.setup();
