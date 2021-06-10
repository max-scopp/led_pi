import AudioEffects from "app/audio/effects";
import { EffectCollection } from "common/effect";

import { Fade } from "./fade";
import { Marquee } from "./marquee";
import { PixelBounce } from "./pixel-bounce";
import { RainbowFancy } from "./rainbow-fancy";
import { RainbowSimple } from "./rainbow-simple";

const Effects: EffectCollection = {
  PixelBounce,
  RainbowSimple,
  RainbowFancy,
  Marquee,
  Fade,
  ...AudioEffects,
};

export default Effects;
