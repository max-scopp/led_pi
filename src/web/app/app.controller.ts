import { Controller, Get, Res } from "@nestjs/common";
import { ListCommands } from "../templates/list-commands";
import * as fastify from "fastify";
import { Dashboard } from "web/templates/dashboard";

@Controller()
export class AppController {
  @Get("*")
  accumulate(@Res() res: FastifyReply) {
    return ListCommands(res);
  }

  @Get("dashboard")
  showDashboard(@Res() res: FastifyReply) {
    return Dashboard(res);
  }
}
