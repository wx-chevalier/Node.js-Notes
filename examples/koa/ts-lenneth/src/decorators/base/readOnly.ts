/**
 * 修饰类属性 不可被修改
 */
import { Writable } from "./writable";

export const ReadOnly = (): Function => {
  return Writable(false);
};
