/**
 * Middleware pipeline for command execution.
 *
 * Middleware functions receive (ctx, next) where ctx carries per-invocation
 * state and next() advances to the next middleware or the terminal handler.
 */
export class Pipeline {
  constructor() {
    this._middleware = [];
  }

  use(fn) {
    this._middleware.push(fn);
    return this;
  }

  async run(ctx, handler) {
    const stack = [...this._middleware];
    let index = 0;

    const next = async () => {
      if (index < stack.length) {
        const fn = stack[index++];
        await fn(ctx, next);
      } else {
        await handler(ctx);
      }
    };

    await next();
  }
}

export const globalPipeline = new Pipeline();
