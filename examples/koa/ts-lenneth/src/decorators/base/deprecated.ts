/**
 * 不推荐方法提示修饰器
 * use:
 *      class Foo{
 *          @Deprecated('Foo.method is Deprecated, please use method2 instead')
 *          public method(){}
 *      }
 *
 */
import { deprecate } from "util";
export function Deprecated(message: string): Function {
  return (
    target: any,
    targetKey: string,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    const originalMethod = descriptor.value;
    descriptor.value = deprecate(originalMethod, message);
    return descriptor;
  };
}
