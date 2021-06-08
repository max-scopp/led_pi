# BeamerPI

Music analyzer and generic led strip controller \w web api & someday BLE support for native app.

## Dependencies

- Tested using Manjaro Lite for RPI 3+
- [audify](https://www.npmjs.com/package/audify)
- [meyda](https://www.npmjs.com/package/meyda)

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
