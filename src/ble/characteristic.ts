import bleno from "@abandonware/bleno";

export class EchoCharacteristic extends bleno.Characteristic {
  _value: Buffer;
  _updateValueCallback: any;

  constructor() {
    super({
      uuid: "ec00",
      properties: ["read", "write", "notify"],
      descriptors: [
        new bleno.Descriptor({
          uuid: "2901",
          value: "Battery level between 0 and 100 percent",
        }),
        new bleno.Descriptor({
          uuid: "2904",
          value: Buffer.from([0x04, 0x01, 0x27, 0xad, 0x01, 0x00, 0x00]), // maybe 12 0xC unsigned 8 bit
        }),
      ],
    });

    this._value = Buffer.from([0x20, 0x04, 0x20]);
    this._updateValueCallback = null;
  }

  onReadRequest(offset: any, callback: any) {
    console.log(
      "EchoCharacteristic - onReadRequest: value = " +
        this._value.toString("hex")
    );

    callback(this.RESULT_SUCCESS, this._value);
  }

  onWriteRequest(data: any, offset: any, withoutResponse: any, callback: any) {
    this._value = data;

    console.log(
      "EchoCharacteristic - onWriteRequest: value = " +
        this._value.toString("hex")
    );

    if (this._updateValueCallback) {
      console.log("EchoCharacteristic - onWriteRequest: notifying");

      this._updateValueCallback(this._value);
    }

    callback(this.RESULT_SUCCESS);
  }

  onSubscribe(maxValueSize: any, updateValueCallback: any) {
    console.log("EchoCharacteristic - onSubscribe");

    this._updateValueCallback = updateValueCallback;
  }

  onUnsubscribe() {
    console.log("EchoCharacteristic - onUnsubscribe");

    this._updateValueCallback = null;
  }
}
