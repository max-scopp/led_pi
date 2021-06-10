import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import Config from "config";
import { createLogger } from "util/logger";
import { AppModule } from "./app/app.module";
import "./render-html";

const log = createLogger("web");

export async function initWebService() {
  const webEnabled = <boolean>Config.web.getItem("ENABLE");

  if (!webEnabled) {
    log("Web service is disabled. Skipping.");
    return;
  }

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  const port = <number>Config.web.getItem("PORT");
  const host = <string>Config.web.getItem("HOST");

  await app.listen(port, host);

  log(`Web service initialized! Listening on http://${host}:${port}`);

  return app;
}
