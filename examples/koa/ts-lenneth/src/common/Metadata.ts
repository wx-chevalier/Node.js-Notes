/**
 * reflect 方法封装
 */
import "reflect-metadata";
import { getClass } from "@utils";
import { DESIGN_TYPE } from "@constants";

export class Metadata {
  static get(key: string, target: any, propertyKey: string | symbol): any {
    return Reflect.getMetadata(key, getClass(target), propertyKey);
  }

  static set(
    key: string,
    value: any,
    target: any,
    propertyKey?: string | symbol
  ): any {
    return propertyKey
      ? Reflect.defineMetadata(key, value, getClass(target), propertyKey)
      : Reflect.defineMetadata(key, value, getClass(target));
  }

  static getOwn(key: string, target: any, propertyKey?: string | symbol): any {
    return propertyKey
      ? Reflect.getOwnMetadata(key, getClass(target), propertyKey)
      : Reflect.getOwnMetadata(key, getClass(target));
  }

  static getType(target, propertyKey?: string | symbol) {
    return Reflect.getMetadata(DESIGN_TYPE, target, propertyKey);
  }
}
