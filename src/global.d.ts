import * as fastify from "fastify";

declare global {
  type TypeOfTypes =
    | "string"
    | "number"
    | "bigint"
    | "boolean"
    | "symbol"
    | "undefined"
    | "object"
    | "function";

  interface MutableSliceableArrayLike<T> {
    [n: number]: T;

    readonly length: number;
    slice(start: number, end?: number): MutableSliceableArrayLike<T>;
  }

  interface AnyObject {
    [key: string]: any;
  }

  type FastifyRequest = fastify.FastifyRequest;
  type FastifyReply = fastify.FastifyReply;
  type FastifyError = fastify.FastifyError;

  type HtmlResponseGenerator = (
    string: TemplateStringsArray
  ) => (reply: FastifyReply) => void;

  declare const html: HtmlResponseGenerator;

  namespace NodeJS {
    interface Global {
      /**
       * Required for annotating html template strings
       * (better than comments IMO)
       */
      html: HtmlResponseGenerator;
    }
  }
}

export {};
