import { Controller, Get, Res } from "@nestjs/common";
import { ListCommands } from "../templates/list-commands";
import * as fastify from "fastify";

@Controller()
export class AppController {
  @Get("*")
  accumulate(@Res() res: FastifyReply) {
    return ListCommands(res);
  }
}
