import { ErrorMiddlewar, Err, Response, Autowired } from "@decorators";
import {
  IErrorMiddlewar,
  TResponse,
  IContext,
  IErrorResponse
} from "@interfaces";
import { HttpStatus } from "@common";
import { LoggerService } from "@services";

/**
 * 全局默认error 事件捕获 处理
 */
@ErrorMiddlewar()
export class LennethGlobalError implements IErrorMiddlewar {
  @Autowired("lenneth-global-error") logger: LoggerService;
  async use(@Err() error: any) {
    this.logger.error(error);
  }
}

/**
 * 自定义异常
 */
export class LennethError extends Error {
  code: string | number;
  constructor(err_opt: IErrorResponse) {
    super();
    this.name = err_opt.name;
    this.code = err_opt.code;
    this.message = err_opt.message;
  }
}
