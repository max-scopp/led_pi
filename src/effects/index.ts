import { Marquee } from "./marquee";
import { PixelBounce } from "./pixel-bounce";
import { RainbowSimple } from "./rainbow-simple";
import { RainbowFancy } from "./rainbow-fancy";
import { EffectCollection } from "util/effect";
import AudioEffects from "audio/effects";

const Effects: EffectCollection = {
  PixelBounce,
  RainbowSimple,
  RainbowFancy,
  Marquee,
  ...AudioEffects,
};

export default Effects;
