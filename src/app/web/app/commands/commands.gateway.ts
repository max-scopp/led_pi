import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from "@nestjs/websockets";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import WebSocket, { Server } from "ws";
import { parentPort } from "worker_threads";
import { OnModuleInit } from "@nestjs/common";

@WebSocketGateway(8080)
export class CommandsGateway implements OnModuleInit {
  @WebSocketServer()
  server?: Server;

  broadcast(message: WorkerMessage) {
    this.server?.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  onModuleInit() {
    const listener = ((message: WorkerMessage) => {
      this.broadcast(message);
    }).bind(this);

    parentPort?.addListener("message", listener);

    this.server?.on("connection", (ws) => {
      ws.on("message", function incoming(json: string) {
        const message = JSON.parse(json);
        parentPort?.postMessage(message);
      });
    });
  }
}
