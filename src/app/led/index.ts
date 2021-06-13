import { createLogger } from "util/logger";
import { StripManager } from "./strip-manager";

export const log = createLogger("led");

export async function initStripManager() {
  try {
    return new StripManager();
  } catch (e) {
    log("Unable to initialize led strip manager:", e);
  }
}
