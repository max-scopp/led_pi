import bleno from "@abandonware/bleno";
import { EchoCharacteristic } from "./characteristic";

var BlenoPrimaryService = bleno.PrimaryService;

console.log("bleno - echo");

bleno.on("stateChange", function (state: any) {
  console.log("on -> stateChange: " + state);

  if (state === "poweredOn") {
    bleno.startAdvertising("echo", ["ec00"]);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on("advertisingStart" as any, function (error: Error) {
  console.log(
    "on -> advertisingStart: " + (error ? "error " + error : "success")
  );

  if (!error) {
    bleno.setServices([
      new BlenoPrimaryService({
        uuid: "ec00",
        characteristics: [new EchoCharacteristic()],
      }),
    ]);
  }
});

export async function initBluetooth() {}
