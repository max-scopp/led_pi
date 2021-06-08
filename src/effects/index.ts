import { Effect } from "util/effect";
import { Rainbow } from "./rainbow";
import { Marquee } from "./marquee";

const Effects: { [key: string]: { new (): Effect } } = {
  Rainbow,
  Marquee,
};

export default Effects;
