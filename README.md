# BeamerPI

Music analyzer and generic led strip controller \w web api & someday BLE support for native app.

## Global dependencies

`npm install -g node-gyp`

## Dependencies

- Tested using Manjaro for RPI 3+
- [audify](https://www.npmjs.com/package/audify)ww
- [meyda](https://www.npmjs.com/package/meyda)

# Useful packages for development

- `pacman -S python-setuptools python-pip python-raspberry-gpio`
- `pip install psutil`
- `pip install RPi.GPIO`
  - if not working use `CFLAGS="-fcommon" pip install rpi.gpio` [here's why](https://gcc.gnu.org/gcc-10/porting_to.html)

## Bluetooth

With bluez5 `bluetoothctl` provides the client.

## Fixes
