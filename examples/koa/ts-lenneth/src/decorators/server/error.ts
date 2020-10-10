/**
 * error 注解，修饰全局处理error中间件
 */
import { LENNETH_ERROR_NAME } from "@constants";
import { createParamsMapKey } from "@utils";
export const ErrorMiddlewar = () => {
  return (target: object | any) => {
    let paramsMapKey = createParamsMapKey(target, "use");
    target.prototype.use[LENNETH_ERROR_NAME] = paramsMapKey;
  };
};
