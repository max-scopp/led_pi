import { AudioStorage } from "./audio";
import { LedStorage } from "./led";
import { WebStorage } from "./web";

const audio = new AudioStorage()
const led = new LedStorage()
const web = new WebStorage()

const Config = {
    audio, led, web,
    async init() {
        return Promise.all([audio.init(), led.init(), web.init()])
    }
}

export default Config