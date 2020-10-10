/**
 * controller类修饰器
 * @Controller("/user")
 * class UserCtroller{
 * }
 */
import { Metadata } from "@common";
import { getClassName } from "@utils";
import { LENNETH_CONTROLLER_PATH } from "@constants";
export const Controller = (path: string = "/"): ClassDecorator => {
  return (target: any): void => {
    Metadata.set(
      `${LENNETH_CONTROLLER_PATH}_${getClassName(target)}`,
      path,
      target
    );
  };
};
