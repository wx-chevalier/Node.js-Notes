/**
 * 修饰类属性，不可以被枚举
 */
import { Enumerable } from "./enumerable";

export const NotEnumerable = (): Function => {
  return Enumerable(false);
};
