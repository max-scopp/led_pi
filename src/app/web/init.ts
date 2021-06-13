import { NestFactory } from "@nestjs/core";
import {
  NestFastifyApplication,
  FastifyAdapter,
} from "@nestjs/platform-fastify";
import { WebStorage } from "config/web";
import { log } from "./index";
import { AppModule } from "./app/app.module";
import { WsAdapter } from "@nestjs/platform-ws";

export const webConfig = new WebStorage();

export async function initWebService() {
  try {
    await webConfig.init();
    const webEnabled = <boolean>webConfig.getItem("ENABLE");

    if (!webEnabled) {
      log("Web service is disabled. Skipping.");
      return;
    }

    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter()
    );

    app.useWebSocketAdapter(new WsAdapter(app));

    const port = <number>webConfig.getItem("PORT");
    const host = <string>webConfig.getItem("HOST");

    await app.listen(port, host);

    log(`Web service initialized! Listening on http://${host}:${port}`);

    return app;
  } catch (e) {
    log("Unable to initialize web services:", e);
  }
}
