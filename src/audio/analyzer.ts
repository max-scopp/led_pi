import { RtAudio } from "audify";
import { Readable } from "stream";
import { print } from "util/print";
// import { audioStream } from "./capture";

import * as asciichart from "asciichart";
import Meyda from "meyda";
import { Main } from "main";
import { CHSV } from "util/hsv";
import { EasingFunctions } from "util/easings";

export class Analyzer {
  lastChunk: Buffer | undefined;

  loudestSeenYet = 0;
  quiestSeenYet = 255;

  constructor(
    private readonly stream: RtAudio,

    // half of that is the size of the amplitute spectrum
    private readonly sampleRate: number
  ) {
    this.stream.setInputCallback(this.analyze.bind(this));
  }

  updateNormalization(loudness: number) {
    if (loudness > this.loudestSeenYet) {
      this.loudestSeenYet = loudness;
    }

    if (loudness < this.quiestSeenYet) {
      this.quiestSeenYet = loudness;
    }
  }

  normalizeLoudness(loudness: number) {
    return (loudness - this.quiestSeenYet) / this.loudestSeenYet;
  }

  normalizeAmplitude(frequencyAmplitude: number) {
    return frequencyAmplitude / (this.sampleRate / 2);
  }

  analyze(chunk: Buffer) {
    // fft size is the buffer size, therefor we divide here by 2
    const ampSize = chunk.length / 2;
    const scaleDown = 4;

    const meyda =
      Meyda.extract(
        ["loudness", "chroma", "amplitudeSpectrum"],
        chunk,
        this.lastChunk
      ) || {};

    this.lastChunk = chunk;

    if (meyda.amplitudeSpectrum) {
      const spectrum = meyda.amplitudeSpectrum;
      const len = spectrum.length;

      for (const i in spectrum) {
        const position = i as any;
        const amplitude = spectrum[position];
        const normalizedAmp = this.normalizeAmplitude(amplitude);

        Main.strip.setPixel(
          position,
          new CHSV(
            80 + normalizedAmp * 260,
            1,
            EasingFunctions.easeInOutQuad(normalizedAmp)
          ).toPixel()
        );
      }
    }

    // if (meyda.amplitudeSpectrum) {
    //   const spectrum = meyda.amplitudeSpectrum;
    //   const len = spectrum.length;

    //   spectrum.forEach((amplitude, position) => {
    //     if (!(position % scaleDown)) {
    //       Main.strip.setPixel(
    //         position / scaleDown,
    //         new CHSV(
    //           180 + (position / len) * 180,
    //           1,
    //           this.normalizeAmplitude(amplitude)
    //         ).toPixel()
    //       );
    //     }
    //   });
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

    Main.strip.render();
  }
}
