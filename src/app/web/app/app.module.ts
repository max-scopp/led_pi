import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { EffectsModule } from './effects/effects.module';
import { SysModule } from './sys/sys.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "../../../", "static"),
    }),

    EffectsModule,
    SysModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
