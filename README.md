# BeamerPI

## Dependencies

- Tested using Manjaro Lite for RPI 3+
- [Noble](https://www.npmjs.com/package/noble)

### Setup

- Change "AutoEnable" to `true` in `sudo vim /etc/bluetooth/main.conf`
- `sudo systemctl start bluetooth.service`
- Start on boot `sudo systemctl enable bluetooth.service`

## Bluetooth

With bluez5 `bluetoothctl` provides the client.

## Fixes

### BLE not working / node version missmatch?

`npm rebuild node-bluetooth`

**Make sure to update the launch.json of vscode!**

Working node versions:

- v10.24.1
- literally, nothing works above.
