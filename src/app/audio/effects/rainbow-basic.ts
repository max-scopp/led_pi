import { Analyzer } from "app/audio/analyzer";
import { Main } from "main";
import Meyda from "meyda";
import { EasingFunctions } from "common/easings";
import { AudioEffect, DynamicEffect } from "common/effect";
import { CHSV } from "core/hsv";

const NOISE_REDUC = 650;

export class RainbowAudialBasic extends AudioEffect {
  FRAMES_PER_SECOND = -1;

  analyzer = Main.analyzer;

  scaleDown = true;

  smoothingTimeConstant = 0.05;

  draw(): void {
    const stripLength = Main.strips?.default.length || 0;

    if (!this.analyzer) {
      return;
    }

    // fft size is the buffer size, therefor we divide here by 2
    // const ampSize = this.analyzer.activeChunk.length / 2;
    const meyda = this.analyzer.extract(["amplitudeSpectrum"]);

    if (!meyda.amplitudeSpectrum) {
      return;
    }

    const result = meyda.amplitudeSpectrum;

    if (result) {
      // the first 2 buckets are effectively VU-Meters,
      // which are the overall impact of the samples and do NOT
      // reside to a specific band.
      // @see https://youtu.be/FGurPgcN5u4?t=1090
      const spectrum = result.slice(2, result.length * 0.7);
      const len = spectrum.length;

      // Main.strip.clear();

      const loudest = Math.max(...(spectrum as any)) - NOISE_REDUC;

      let freq_avg = 0;

      for (let i = 0; i < spectrum.length; i++) {
        const perc = i / spectrum.length;

        //const ROLLOFF = EasingFunctions.Quintic.Out(perc) * NOISE_REDUC;
        const ampRaw = spectrum[i] - NOISE_REDUC; // + ROLLOFF;
        const ampNormal = this.analyzer.normalizeAmplitude(ampRaw);
        const ampLinear = ampRaw / loudest;

        freq_avg += ampRaw;

        const posInStrip = stripLength * perc;

        const amplitudeColor = new CHSV(
          (perc * 360 + 180) % 360,
          1,
          EasingFunctions.Quintic.Out(ampLinear)
        );

        // console.log(
        //   `${posInStrip.toFixed(4)}\t${(ampRaw % 360).toFixed(
        //     4
        //   )}\t${ampPerc.toFixed(4)}`
        // );

        Main.strips?.default.setPixel(
          this.scaleDown ? Math.trunc(posInStrip) : i,
          amplitudeColor
        );
      }

      // console.log("avg freq", freq_avg / spectrum.length);
    }
  }
}
