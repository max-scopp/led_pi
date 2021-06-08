import { blendColor } from "./color";
import { CRGB } from "./rgb";

export class CWheel {
  static Red = new CRGB(255, 0, 0);
  static Green = new CRGB(0, 255, 0);
  static Blue = new CRGB(0, 0, 255);

  static Yellow = blendColor(CWheel.Red, CWheel.Green);
  static Violet = blendColor(CWheel.Red, CWheel.Blue);

  static Orange = blendColor(CWheel.Red, CWheel.Yellow);
  static YellowOrange = blendColor(CWheel.Orange, CWheel.Yellow);
  static RedOrange = blendColor(CWheel.Orange, CWheel.Red);

  static YellowGreen = blendColor(CWheel.Yellow, CWheel.Green);
  static BlueGreen = blendColor(CWheel.Blue, CWheel.Green);

  static BlueViolet = blendColor(CWheel.Blue, CWheel.Violet);
  static RedViolet = blendColor(CWheel.Red, CWheel.Violet);
}
