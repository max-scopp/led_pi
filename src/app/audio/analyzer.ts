import { RtAudio } from "audify";
import { Readable } from "stream";
import { print } from "util/print";
// import { audioStream } from "./capture";

import * as asciichart from "asciichart";
import Meyda, { MeydaAudioFeature } from "meyda";
import { Main } from "main";
import { CHSV } from "core/hsv";
import { EasingFunctions } from "common/easings";

export class Analyzer {
  activeChunk = Buffer.of();
  lastChunk = Buffer.of();

  constructor(
    private readonly stream: RtAudio,

    // half of that is the size of the amplitute spectrum
    readonly sampleRate: number,

    readonly frameSize: number
  ) {
    this.stream.setInputCallback(this.analyze.bind(this));
    this.stream.start();
  }

  normalizeAmplitude(frequencyAmplitude: number) {
    return frequencyAmplitude / (this.sampleRate / 2);
  }

  extract(features: MeydaAudioFeature[]) {
    return Meyda.extract(features, this.activeChunk, this.lastChunk) || {};
  }

  /**
   *
   * @param spectrum The spectrum the smoothing should be applied to.
   * @param smoothingTimeConstant Value between zero and one. A value of one causes a large moving average window and smoothed results. A value of zero means no moving average, and quickly fluctuating results.
   */
  smoothing(spectrum: Float32Array, smoothingTimeConstant: number) {
    const spectr = new Float32Array(spectrum.length);

    for (let i = 0; i < spectrum.length; i++) {
      var val = spectrum[i],
        j = 0,
        ms;

      spectr[i] = (val + val * smoothingTimeConstant) / 2;
    }

    return spectr;
  }

  analyze(chunk: Buffer) {
    this.activeChunk = chunk;
    this.lastChunk = this.activeChunk;

    // if (meyda.amplitudeSpectrum) {
    //   const spectrum = meyda.amplitudeSpectrum;
    //   const len = spectrum.length;

    //   for (const i in spectrum) {
    //     const position = i as any;
    //     const amplitude = spectrum[position];
    //     const normalizedAmp = this.normalizeAmplitude(amplitude);

    //     Main.strip.setPixel(
    //       position,
    //       new CHSV(
    //         80 + normalizedAmp * 260,
    //         1,
    //         EasingFunctions.Quadratic.InOut(normalizedAmp)
    //       ).toPixel()
    //     );
    //   }
    // }

    // if (meyda.loudness) {
    //   const len = meyda.loudness.specific.length;
    //   meyda.loudness.specific.forEach((specificLoudness, position) => {
    //     this.updateNormalization(specificLoudness);

    //     const normalizedSpecificLoudness =
    //       this.normalizeLoudness(specificLoudness);

    //     process.stdout.write(`\r${normalizedSpecificLoudness}`);

    //     Main.strip.pixels[position] = new CHSV(
    //       (position / len) * 360,
    //       1,
    //       normalizedSpecificLoudness
    //     ).toPixel();
    //   });
    // }

    // if (meyda.chroma) {
    //   meyda.chroma.forEach((chroma, index) => {
    //     Main.strip.pixels[index] = new CHSV(chroma * 300, 1, 1).toPixel();
    //   });
    // }
  }
}
