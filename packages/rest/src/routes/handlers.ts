import { Request, RequestHandler } from "express";

export function promiseHandler(fn: RequestHandler): RequestHandler {
  return (req, res, next): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function jsonHandler(
  fn: (req: Request) => Promise<unknown>
): RequestHandler {
  return promiseHandler(
    async (req, res, next): Promise<void> => {
      const value = await fn(req);
      if (value === undefined) {
        next();
      } else {
        res.json(value);
      }
    }
  );
}
