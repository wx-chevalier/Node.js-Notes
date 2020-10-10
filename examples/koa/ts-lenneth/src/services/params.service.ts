/**
 * requset参数类
 */
import { Service } from "@decorators";
import { BaseService } from "./base.service";
import { IParamsMapKey, IParamsMapValue, IContext, TNext } from "@interfaces";
import { ParamsType, HttpStatus } from "@common";
import { getClassName, isJsonString } from "@utils";

// @Service()
export class ParamsService extends BaseService {
  // params 参数集合
  // map key classname_propertyKey
  static paramsMap: Map<string, IParamsMapValue[]> = new Map();

  /**
   * 拼接 paramsMap key值
   * @param target
   * @param propertyKey
   */
  static fomartParamsMapKey(target: object | any, propertyKey: string) {
    return `${getClassName(target)}_${propertyKey}`;
  }

  /**
   * 返回参数序列
   * @param paramsMapKey
   * @param ctx
   */
  paramsToList(paramsMapKey: string, ctx: IContext, next: TNext) {
    // 不存在key值时直接返回一个空数组
    if (!ParamsService.paramsMap.has(paramsMapKey)) return [];
    return ParamsService.paramsMap.get(paramsMapKey).map(item => {
      switch (item.paramsType) {
        case ParamsType.PATHPARAMS:
          // path
          return ctx.params[item.paramsKey];
        case ParamsType.QUERYPARAMS:
          // query
          return ctx.request.query[item.paramsKey];
        case ParamsType.BODYPARAMS:
          // body
          return item.paramsKey
            ? ctx.request.body[item.paramsKey]
            : ctx.request.body;
        case ParamsType.REQUEST:
          // request
          return ctx.req;
        case ParamsType.RESPONSE:
          // response
          return ctx.response;
        case ParamsType.NEXT:
          // next
          return next;
        case ParamsType.HEADERPARAMS:
          // header
          return item.paramsKey
            ? ctx.request.headers[item.paramsKey]
            : ctx.request.headers;
        default:
          break;
      }
    });
  }

  /**
   * 错误中间件参数处理
   * @param paramsMapKey
   * @param err
   * @param ctx
   */
  paramsToErrorList(paramsMapKey: string, err: Error, ctx: IContext): any[] {
    if (!ParamsService.paramsMap.has(paramsMapKey)) return [];
    return ParamsService.paramsMap.get(paramsMapKey).map(item => {
      switch (item.paramsType) {
        case ParamsType.ERROR:
          // 异常字符处理
          return {
            message: err.message,
            status: err["status"] || HttpStatus.INTERNAL_SERVER_ERROR,
            data: err["errorData"]
          };
        default:
          break;
      }
    });
  }
}
