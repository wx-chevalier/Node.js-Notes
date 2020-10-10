/**
 * 修饰类属性， 设置为true可以被重写；设置为false，不能被重写。
 *
 * class Foo{
 *      @Writable(true)
 *      private test;
 * }
 */
import { descriptorOf } from "@utils";

export const Writable = (value: boolean = true): Function => {
  return (target: any, propertyKey: string) => {
    const descriptor = descriptorOf(target, propertyKey) || {
      configurable: true,
      enumerable: true
    };
    descriptor.writable = value;
    Object.defineProperty(
      (target && target.prototype) || target,
      propertyKey,
      descriptor
    );
    return descriptor;
  };
};
