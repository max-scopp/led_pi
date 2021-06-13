# Setup RPI

## Run on boot

0. Build app and make sure it's working.
1. further steps described in `rpi_services/rpi_led.service`

## Debug without LAN / Nearby WLAN

Solution: Create an access point. Requires `create_ap`.

1. `pacman -S create_ap`
2. further steps described in `rpi_services/debug_ap.service`

## WiFi via RaspAP

https://wiki.archlinux.org/title/Software_access_point

## Audio via ALSA

- Make sure your USB Audio dongle is detected `lsusb`
- [Setup ALSA](https://wiki.archlinux.de/title/Advanced_Linux_Sound_Architecture)
- Make sure your dongle is in `alsamixer` (use F6 to switch device!)
- Basically, that's it! You can select the desired device in the app.

- (Optional) Set your dongle as default audio device
  - Find your card of the dongle `aplay -l`
  - Set the card id (index) as default `vim /etc/asound.conf`
  - Insert
    ```plain
    defaults.pcm.card <CARD_ID>
    defaults.ctl.card <CARD_ID>
    ```

## Bluetooth

_TBD_

- Change "AutoEnable" to `true` in `sudo vim /etc/bluetooth/main.conf`
- `sudo systemctl start bluetooth.service`
- Start on boot `sudo systemctl enable bluetooth.service`

### BLE not working / node version missmatch?

`npm rebuild node-bluetooth`

**Make sure to update the launch.json of vscode!**

Working node versions:

- v10.24.1
- literally, nothing works above.
