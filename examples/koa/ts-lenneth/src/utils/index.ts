import * as Koa from "koa";
import { Metadata } from "@common";
import { TApiMiddleware, IContext, TNext } from "@interfaces";

/**
 *  获取类
 * @param target
 */
export const getClass = (target: any): any => {
  return target.prototype ? target : target.constructor;
};

export const getClassOrSymbol = (target: any): any => {
  return typeof target === "symbol" ? target : getClass(target);
};

/**
 * 获取类名
 */
export const getClassName = (target: any): string => {
  return typeof target === "function" ? target.name : target.constructor.name;
};

/**
 *  判空
 * @param value
 */
export const isEmpty = (value: any): boolean => {
  return value === "" || value === null || value === undefined;
};

/**
 *  判数组
 * @param target
 */
export const isArray = (target: any): boolean => {
  return Array.isArray(target);
};

/**
 * 获取该属性的描述对象
 * @param target 类
 * @param propertyKey 目标属性
 */
export const descriptorOf = (
  target: any,
  propertyKey: string
): PropertyDescriptor | undefined => {
  return Reflect.getOwnPropertyDescriptor(
    (target && target.prototype) || target,
    propertyKey
  );
};

/**
 * 生成数组
 * @param target
 */
export const toArray = (target: any): any[] => {
  return target ? (Array.isArray(target) ? target : [target]) : [];
};

/**
 * 是否json串
 * @param str
 */
export const isJsonString = (str: string) => {
  try {
    if (typeof JSON.parse(str) == "object") {
      return true;
    }
  } catch (e) {}
  return false;
};

/**
 * 接口描述映射表key
 * @param target
 * @param propertyKey
 */
export const apiDescriptionMapKey = (
  target: object | any,
  propertyKey: any
) => {
  return `${getClassName(target)}_${propertyKey}`;
};

export const createParamsMapKey = (target: object | any, propertyKey: any) => {
  return `${getClassName(target)}_${propertyKey}`;
};

/**
 * 在每个方法的最外层封装一个原装的中间件，
 * 这样就能够在各自的方法体内获得属性修饰器，不受原来koa中间件的影响
 * @param target 关系this指向
 * @param middleware 新lenneth中间件
 * @param key 存储map key
 */
export const toAsyncMiddleware = (
  target: Object | any,
  middleware: TApiMiddleware,
  key?: string,
  cb?: (key: string, ctx: IContext, next: TNext) => any[]
) => {
  return async (ctx: IContext, next: TNext) => {
    if (key) {
      // 此处一定要用call来重新设置this指向
      return middleware.call(target, ...cb(key, ctx, next), ctx, next);
    }
    return middleware.call(target, ctx, next);
  };
};

/**
 * 错误中间件处理
 * @param target
 * @param middleware
 * @param key
 * @param cb
 */
export const toErrorAsyncMiddleware = (
  target: Object | any,
  middleware: TApiMiddleware,
  key?: string,
  cb?: (key: string, err: Error, ctx: IContext) => any[]
) => {
  return (err: Error, ctx: IContext) => {
    return middleware.call(target, ...cb(key, err, ctx), ctx);
  };
};
