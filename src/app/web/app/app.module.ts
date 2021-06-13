import { CommandsModule } from "./commands/commands.module";
import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

import { AppController } from "./app.controller";
import { SysModule } from "./sys/sys.module";

@Module({
  imports: [
    CommandsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "../../../", "static"),
    }),

    SysModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
