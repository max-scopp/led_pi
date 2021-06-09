import { MS_PER_SECOND } from "../constants";

export function fps(start: number, end: number) {
  const mDuration = end - start;
  const fpsf = 1.0 / (mDuration / MS_PER_SECOND);

  return Math.trunc(fpsf);
}
