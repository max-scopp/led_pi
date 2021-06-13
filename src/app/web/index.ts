import { createLogger } from "util/logger";
import { initWebService } from "./init";
import "./render-html";

export const log = createLogger("web");

initWebService();
