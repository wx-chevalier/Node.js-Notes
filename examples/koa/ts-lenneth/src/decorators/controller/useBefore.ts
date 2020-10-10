/**
 * 类方法中间件，在方法执行前执行
 *
 *  @Controller('/user')
 *  class User{
 *
 *      @Get('/list')
 *      @UseBefore(UserMiddleware, GoodsMiddleware)
 *      async list(){
 *      }
 *  }
 */
import { toArray, getClassName } from "@utils";
import { ParamsService } from "@services";
export const UseBefore = (...middClassList: Function[]): Function => {
  return (target: any, name: string, descriptor: ParameterDecorator) => {
    let middlewareList = [];
    middClassList.forEach(item => {
      // 对中间件的特殊处理，否则中间件属性修饰器无效
      // 旧值key
      let paramsMapKey = ParamsService.fomartParamsMapKey(item, "use");
      // 替换的key
      let useBeforeMiddlewareName = `${getClassName(
        target
      )}_${name}_${paramsMapKey}`;
      // 替换值
      ParamsService.paramsMap.set(
        useBeforeMiddlewareName,
        ParamsService.paramsMap.get(paramsMapKey)
      );
      // 删除原值
      // ParamsService.paramsMap.delete(paramsMapKey);
      middlewareList.push(item.prototype["use"]);
    });
    target[name] = toArray(target[name]);
    target[name] = middlewareList.concat(target[name]);
  };
};
