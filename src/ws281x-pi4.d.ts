declare module "ws281x-pi4" {
  namespace ws281x {
    export const leds: number;

    export const map: StripMap;

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

    export function configure(options: Configuration): void;

    export function fill(color: number): void;

    export function render(pixels: Uint32Array): void;

    export function reset(): void;

    export function sleep(ms: number): void;
  }

  export default ws281x;
}
