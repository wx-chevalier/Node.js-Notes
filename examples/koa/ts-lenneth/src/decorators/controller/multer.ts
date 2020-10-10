import * as originalMulter from "koa-multer";
import { IMulterOptions } from "@interfaces";
import { getClassName } from "@utils";
/**
 * 上传文件注解
 * @param options
 */
export const Multer = (options?: IMulterOptions): Function => {
  return (
    target: object | any,
    propertyKey: string,
    descriptor: ParameterDecorator
  ) => {
    let name = `${getClassName(target)}_${propertyKey}_Multer`;
    target[name] = originalMulter((options && options.options) || {}).single(
      (options && options.single) || "file"
    );
  };
};
