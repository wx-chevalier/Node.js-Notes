export const SERVER_SETTINGS = "lenneth:server:settings";

/** 
 * 原生定义反射类型 
      // 获取成员类型
  let type = Reflect.getMetadata('design:type', target, propertyKey)
  // 获取成员参数类型
  let paramtypes = Reflect.getMetadata('design:paramtypes', target, propertyKey)
  // 获取成员返回类型
  let returntype = Reflect.getMetadata('design:returntype', target, propertyKey)
  // 获取所有元数据 key (由 TypeScript 注入)
  let keys = Reflect.getMetadataKeys(target, propertyKey)
 */

// 获取成员类型
export const DESIGN_TYPE = "design:type";

// 获取成员参数类型
export const DESIGN_PARAM_TYPES = "design:paramtypes";

// 获取成员返回类型
export const DESIGN_RETURN_TYPE = "design:returntype";
