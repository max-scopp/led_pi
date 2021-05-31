import { Controller, Get } from "@nestjs/common";
import Effects from "effects";
import { Main } from "main";

@Controller("effects")
export class EffectsController {
  @Get("rainbow")
  rainbowEffect() {
    Main.strip.setEffect(Effects.Rainbow);
  }
}
