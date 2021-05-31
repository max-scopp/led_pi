import * as fastify from "fastify";

declare global {
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
