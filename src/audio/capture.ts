import { RtAudio, RtAudioFormat } from "audify";
import { Analyzer } from "./analyzer";

import promps from "prompts";
import { print } from "util/print";

export async function initAudio() {
  // Init RtAudio instance using default sound API
  const rtAudio = new RtAudio(/* Insert here specific API if needed */);

  const devices = rtAudio.getDevices();

  const answers = await promps({
    type: "select",
    name: "deviceId",
    message: "Select a device",
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

  const targetDevice = devices[answers.deviceId];

  // Open the input/output stream
  rtAudio.openStream(
    // {
    //   deviceId: rtAudio.getDefaultOutputDevice(), // Output device id (Get all devices using `getDevices`)
    //   nChannels: 1, // Number of channels
    //   firstChannel: 0, // First channel index on device (default = 0).
    // },
    null,
    {
      deviceId: answers.deviceId,
      nChannels: targetDevice.inputChannels,
    },
    RtAudioFormat.RTAUDIO_SINT16, // PCM Format - Signed 16-bit integer
    targetDevice.preferredSampleRate, // Sampling rate is 48kHz
    512 * 4, // Frame size is 1920 (40ms)
    "MyStream", // The name of the stream (used for JACK Api)
    null,
    null
  );

  print(`Listening on ${targetDevice.name}`);

  // Start the stream
  rtAudio.start();

  return new Analyzer(rtAudio, targetDevice.preferredSampleRate);
}
