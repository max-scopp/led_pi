import {
  Controller,
  Get,
  Post,
  Param,
  BadRequestException,
} from "@nestjs/common";
import _Effects from "effects";
import { Main } from "main";
import { Effect } from "util/effect";

const Effects = _Effects as { [key: string]: { new (): Effect } };

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
