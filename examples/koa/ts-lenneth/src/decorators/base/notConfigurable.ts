/**
 * 修饰类属性，不可以重新定义或删除
 */
import { Configurable } from "./configurable";

export const NotConfigurable = (): Function => {
  return Configurable(false);
};
