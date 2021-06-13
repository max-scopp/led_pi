import { Module } from "@nestjs/common";
import { CommandsGateway } from "./commands.gateway";

@Module({
  imports: [],
  controllers: [],
  providers: [CommandsGateway],
})
export class CommandsModule {}
