import { EffectsModule } from "./effects/effects.module";
import { SysModule } from "./sys/sys.module";
import { AppController } from "./app.controller";
import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
const path = join(__dirname, "../../../", "static");
console.log(path);
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path,
    }),

    EffectsModule,
    SysModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
