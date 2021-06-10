import {
  Controller,
  Get,
  Post,
  Param,
  BadRequestException,
} from "@nestjs/common";
import Effects from "app/led/effects";
import { Main } from "main";

@Controller("effects")
export class EffectsController {
  @Get("list")
  listEffects() {
    return Object.keys(Effects);
  }

  @Post(":effect")
  rainbowEffect(@Param() effect: string) {
    if (Effects[effect]) {
      return Main.strip.setEffect(Effects[effect]);
    }

    throw new BadRequestException("Unknown effect");
  }
}
