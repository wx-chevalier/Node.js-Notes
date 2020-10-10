/**
 * 返回值统一处理
 * 放在中间件最后的地方
 */
import { IMiddleware, IContext, TResponse, TNext } from "@interfaces";
import { Middleware, Response, Next } from "@decorators";
import { HttpStatus, ResponseStatus } from "@common";
import { LennethError } from "./Lenneth-error";
@Middleware()
export class LennethResponse implements IMiddleware {
  async use(
    @Response() response: TResponse,
    @Next() next: TNext,
    ctx: IContext
  ) {
    try {
      // 执行前面所有的中间件
      await next();
      let body = response.body || ctx.body;
      // 统一处理返回
      if (body) {
        return (response.body = {
          code: 0,
          message: ResponseStatus.SUCCESS,
          data: response.body
        });
      }
      return (response.body = { code: 0, message: ResponseStatus.SUCCESS });
    } catch (err) {
      ctx.status = err.code;
      response.status = HttpStatus.OK;
      if (err instanceof LennethError) {
        response.body = {
          code: err.code,
          message: err.message || ResponseStatus.ERROR
        };
      } else {
        response.body = {
          code: err.code || HttpStatus.INTERNAL_SERVER_ERROR,
          message: err.message || ResponseStatus.ERROR
        };
        // 未识别错误 抛至最外层error全局处理
        throw err;
      }
    }
  }
}
