import { DynamicEffect } from 'common/effect';
import { CWheel } from 'core/color-wheel';
import { Main } from 'main';

export class Marquee extends DynamicEffect {
  scroll = 0.0;

  draw() {
    const stripLength = Main.strips?.default.length || 0;

    this.scroll += 0.02;

    if (this.scroll > 5) {
      this.scroll -= 5;
    }

    for (let i = this.scroll; i < stripLength - 1; i += 5) {
      Main.strips?.default.drawPixels(i, CWheel.Green, 2);
    }
  }
}
