import { Controller, Get } from "@nestjs/common";
import si from "systeminformation";

@Controller("sys")
export class SysController {
  @Get("temp")
  cpuTemp() {
    return si.cpuTemperature();
  }
}
