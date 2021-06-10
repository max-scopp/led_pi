import { Marquee } from "./marquee";
import { PixelBounce } from "./pixel-bounce";
import { RainbowSimple } from "./rainbow-simple";
import { RainbowFancy } from "./rainbow-fancy";
import { EffectCollection } from "common/effect";
import AudioEffects from "app/audio/effects";

const Effects: EffectCollection = {
  PixelBounce,
  RainbowSimple,
  RainbowFancy,
  Marquee,
  ...AudioEffects,
};

export default Effects;
