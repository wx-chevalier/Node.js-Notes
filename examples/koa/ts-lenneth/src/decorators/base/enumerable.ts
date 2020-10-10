/**
 * 修饰类属性，能够通过for-in循环返回属性。设置为true可以被枚举；设置为false，不能被枚举。
 * class Foo{
 *      @Enumerable(true)
 *      private test;
 * }
 */
import { descriptorOf } from "@utils";

export const Enumerable = (value: boolean = true): Function => {
  return (target: any, propertyKey: string) => {
    const descriptor = descriptorOf(target, propertyKey) || {
      writable: true,
      configurable: true
    };
    descriptor.enumerable = value;
    Object.defineProperty(
      (target && target.prototype) || target,
      propertyKey,
      descriptor
    );
    return descriptor;
  };
};
