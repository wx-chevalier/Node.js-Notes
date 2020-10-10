/**
 * 修饰类属性，能否通过delete删除属性从而重新定义属性，
 * 能够修改属性的特性，或者能否把属性修改为访问属性。
 * 设置为true可以被删除或可以重新设置特性；设置为false，不能被可以被删除或不可以重新设置特性。
 *
 * class Foo{
 *      @Configurable(true)
 *      private test;
 * }
 */
import { descriptorOf } from "@utils";

export const Configurable = (value: boolean = true): Function => {
  return (target: any, propertyKey: string) => {
    const descriptor = descriptorOf(target, propertyKey) || {
      writable: true,
      enumerable: true
    };
    descriptor.configurable = value;
    Object.defineProperty(
      (target && target.prototype) || target,
      propertyKey,
      descriptor
    );
    return descriptor;
  };
};
