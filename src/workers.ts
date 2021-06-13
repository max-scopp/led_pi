import { Worker } from "worker_threads";
import { resolve } from "path";
import { createLogger } from "util/logger";

const log = createLogger("workers");

export class WorkerManager {
  workers = new Map<string, Worker>();

  constructor() {}

  addWorker<F extends Function>(name: string, filepath: string, onMessage: F) {
    const worker = new Worker(resolve(__dirname, "app/web/index.js"));

    this.workers.set(name, worker);

    worker.on("online", () => log(`${name} is online`));
    worker.on("error", (error: Error) => log(error));
    worker.on("exit", (code: number) =>
      log(`${name} exited with code ${code}`)
    );

    worker.on("messageerror", (error: Error) => log(error));
    worker.on("message", (message: any) => onMessage(message));

    return worker;
  }

  getWorker(name: string) {
    return this.workers.get(name);
  }

  postMessage(name: string, message: WorkerMessage) {
    const worker = this.getWorker(name);

    worker?.postMessage(message);
  }
}
