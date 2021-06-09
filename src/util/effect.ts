import { Analyzer } from "audio/analyzer";

export enum EffectKind {
  Static,
  Dynamic,
  Audial,
}

/**
 * Base effect signature
 */
export interface IEffect {
  /**
   * configures when to call draw(), dynamically adjustable
   * -1 means as many as possible
   * 0 means use the default fps
   */
  FRAMES_PER_SECOND: number;

  draw(t: number): void;
}

/**
 * multiple effects grouped together
 */
export type EffectCollection = { [key: string]: { new (): IEffect } };

/**
 * Do not use.
 */
abstract class BaseEffect implements IEffect {
  static KIND: EffectKind;

  abstract FRAMES_PER_SECOND: number;

  /**
   *
   * @param t milliseconds elapsed since strip is rendering.
   */
  abstract draw(t: number): void;
}

export abstract class DynamicEffect extends BaseEffect {
  static KIND = EffectKind.Dynamic;
}

export abstract class AudioEffect extends BaseEffect {
  static KIND = EffectKind.Audial;
}
