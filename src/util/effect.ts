import { Analyzer } from "audio/analyzer";

export enum EffectKind {
  Static,
  Dynamic,
  Audial,
}

/**
 * Base effect signature
 */
export interface Effect {
  /**
   * configures when to call draw(), dynamically adjustable
   * -1 means as many as possible
   * 0 means use the default fps
   */
  FRAMES_PER_SECOND: number;

  onMount?: () => void;
  onUnmount?: () => void;

  /**
   *
   * @param t milliseconds elapsed since strip is rendering.
   */
  draw(t: number): void;
}

/**
 * multiple effects grouped together
 */
export type EffectCollection = { [key: string]: { new (): Effect } };

/**
 * Do not use.
 */
export abstract class Effect {
  static KIND: EffectKind;
}

export abstract class DynamicEffect extends Effect {
  static KIND = EffectKind.Dynamic;
}

export abstract class AudioEffect extends Effect {
  static KIND = EffectKind.Audial;
}
