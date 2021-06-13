import { Worker, parentPort } from "worker_threads";

/**
 * Posts a message, then waits for a response and resolves the promise.
 *
 * TODO: Add timeout feature
 */
export async function postAndWaitResponse<
  Res extends WorkerMessage,
  Req extends WorkerMessage
>(command: Req, responseType: Res["type"], toWorker?: Worker): Promise<Res> {
  return new Promise((resolve, reject) => {
    const listener = (response: WorkerMessage) => {
      if (response.type === responseType) {
        parentPort?.removeListener("message", listener);
        resolve(response as Res);
      }
    };

    // if we sent from worker
    if (parentPort !== null) {
      parentPort.postMessage(command);
      parentPort.on("message", listener);
    } else if (toWorker) {
      toWorker.postMessage(command);
      toWorker.on("message", listener);
    } else {
      throw new Error("Neither waiting from parent nor from worker.");
    }
  });
}
