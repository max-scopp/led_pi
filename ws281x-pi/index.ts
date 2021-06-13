var path = require("path");
var addon = require(path.join(
  __dirname,
  "build",
  "Release",
  "rpi-ws281x.node"
));

export type StripMap = "matrix" | "alternating-matrix" | Uint32Array;

export type StripType = "rgb" | "rbg" | "grb" | "gbr" | "bgr" | "brg";

export interface Configuration {
  width?: number;
  height?: number;

  leds?: number;

  map?: StripMap;

  /**
   * @default 10
   */
  dma?: number;

  /**
   * @default 255
   */
  brightness?: number;

  /**
   * @default 18
   */
  gpio?: number;

  /**
   * @default "rgb"
   */
  stripType?: StripType;
}

export default class Ws281x {
  protected strip_map: StripMap;
  protected led_count: number;

  constructor(protected readonly options: Configuration) {
    var { width, height, map, leds } = options;

    if (width != undefined || height != undefined) {
      if (width == undefined) {
        throw new Error("Must specify width if height is specified.");
      }

      if (height == undefined) {
        throw new Error("Must specify height if width is specified.");
      }

      if (leds != undefined) {
        throw new Error(
          "Please do not specify leds when both width and height are specified."
        );
      }

      leds = width * height;

      if (typeof map == "string") {
        if (map == "matrix") {
          map = new Uint32Array(width * height);

          for (var i = 0; i < map.length; i++) map[i] = i;
        } else if (map == "alternating-matrix") {
          map = new Uint32Array(width * height);

          for (var i = 0; i < map.length; i++) {
            var row = Math.floor(i / width),
              col = i % width;

            if (row % 2 === 0) {
              map[i] = i;
            } else {
              map[i] = (row + 1) * width - (col + 1);
            }
          }
        }
      }
    }

    // Make sure the number of leds are specified
    if (leds == undefined) {
      throw new Error(
        "Number of leds must be defined. Either by leds or by width and height."
      );
    }

    // If no map specified, create a default one...
    if (map == undefined) {
      map = new Uint32Array(leds);

      for (var i = 0; i < leds; i++) map[i] = i;
    }

    // Make sure we have a correct instance of pixel mapping
    if (!(map instanceof Uint32Array))
      throw new Error("Pixel mapping must be an Uint32Array.");

    if (map.length != leds)
      throw new Error(
        "Pixel mapping array must be of the same size as the number of leds."
      );

    this.strip_map = map;
    this.led_count = leds;

    addon.configure(options);
  }

  get brightness() {
    return this.options.brightness || 0;
  }

  reset() {
    if (this.led_count != undefined) {
      this.render(new Uint32Array(this.led_count));
      addon.reset();
    }
  }

  sleep(ms: number) {
    addon.sleep(ms);
  }

  setBrightness(brightness: number) {
    const use_brightness =
      brightness > 255 ? 255 : brightness < 0 ? 0 : brightness;

    addon.set_brightness(use_brightness);

    this.options.brightness = use_brightness;
  }

  render(pixels: Uint32Array | Buffer) {
    if (this.strip_map != undefined) {
      // Convert to Uint32Array if a Buffer
      if (pixels instanceof Buffer)
        pixels = new Uint32Array(pixels.buffer, pixels.byteOffset);

      if (this.led_count != pixels.length)
        throw new Error(
          "Pixels must be of same length as number of leds in render()."
        );

      addon.render(pixels, this.strip_map);
    }
  }

  fill(color: number) {
    const pixels = new Uint32Array(this.led_count);
    for (let i = 0; i < this.led_count; i++) {
      pixels[i] = color;
    }
    this.render(pixels);
  }
}
