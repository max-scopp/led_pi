export interface Effect {
  /**
   * configures when to call draw(), dynamically adjustable
   * -1 means as many as possible
   * 0 means use the default fps
   */
  FRAMES_PER_SECOND: number;
  draw(): void;
}
