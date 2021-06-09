import { RtAudio, RtAudioFormat, RtAudioStreamFlags } from "audify";
import Config from "config";
import promps from "prompts";
import { print } from "util/print";

import pkg from "../../package.json";
import { Analyzer } from "./analyzer";

export async function initAudio() {
  const rtAudio = new RtAudio();

  const devices = rtAudio.getDevices();

  let deviceId = <number>Config.audio.getItem("DEFAULT_DEVICE_ID");

  if (!(deviceId >= 0)) {
    const answers = await promps({
      type: "select",
      name: "deviceId",
      message: "Select a device (this will be remembered for the next start)",
      choices: devices.map((device) => {
        const {
          name,
          isDefaultInput,
          isDefaultOutput,
          inputChannels,
          preferredSampleRate,
        } = device;

        return {
          title: name,
          description: JSON.stringify({
            isDefaultInput,
            isDefaultOutput,
            inputChannels,
            preferredSampleRate,
          }),
        };
      }),
    });

    Config.audio.setItem("DEFAULT_DEVICE_ID", answers.deviceId);
    deviceId = answers.deviceId;
  }

  const targetDevice = devices[deviceId];
  const fftSize = 512; // this is good with accounting last fft for analysis

  rtAudio.openStream(
    null,
    {
      deviceId,
      nChannels: targetDevice.inputChannels,
    },
    RtAudioFormat.RTAUDIO_FLOAT32,
    targetDevice.preferredSampleRate, // usually 44.1kHz or 48kHz
    fftSize,
    pkg.name, // used for JACK Api
    null,
    null,
    RtAudioStreamFlags.RTAUDIO_MINIMIZE_LATENCY
  );

  return new Analyzer(rtAudio, targetDevice.preferredSampleRate, fftSize);
}
