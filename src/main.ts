import { initBluetooth } from "ble";
import tinycolor from "tinycolor2";
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

  static uncaughtException(exitCode: number) {
    print("Unexpected error!");
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

    //catches uncaught exceptions
    // process.on("uncaughtException", this.uncaughtException.bind(this));

    print("Initialize web service...");
    createWebService();

    print("Initialize BLE ...");
    initBluetooth();

    this.strip.fill(colorFromString("tomato"));
    // print("Running...");
    // setInterval(this.changeColor.bind(this), 1e3);
  }

  static changeColor() {
    const redHSV = colorFromString("red");
    const greenHSV = colorFromString("green");
    const blueHSV = colorFromString("blue");

    const redAlpha1 = redHSV.clone();
    redAlpha1.v = 0.5;

    const redAlpha2 = redHSV.clone();
    redAlpha2.v = 0.1;

    const mix1 = blendColor(redHSV, greenHSV);
    const mix2 = blendColor(mix1, blueHSV);

    const colors = [
      redAlpha2,
      redAlpha1,
      redHSV,
      greenHSV,
      blueHSV,
      mix1,
      mix2,
    ];

    this.iteration++;

    if (!colors[this.iteration]) {
      this.iteration = 0;
    }

    const fillIteration = colors[this.iteration];
    print(`iteration ${this.iteration}`, fillIteration);

    this.strip.fill(fillIteration);
  }
}

Main.setup();
