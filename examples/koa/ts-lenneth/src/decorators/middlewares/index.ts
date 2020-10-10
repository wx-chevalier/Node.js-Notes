/**
 * 修饰类，生成koa中间件
 */
import { getClassName } from "@utils";
import { LENNETH_MIDDLEWARE_NAME } from "@constants";
export const Middleware = () => {
  return (target: any) => {
    // 给use方法添加一个middlewarName属性
    let middlewarName = `${getClassName(target)}_use`;
    target.prototype.use[LENNETH_MIDDLEWARE_NAME] = middlewarName;
  };
};
