import { ParamsType } from "../../common";
export interface IParamsMapKey {
  // 目标类
  target: object | any;
  // 方法名
  propertyKey: string | symbol;
}

export interface IParamsMapValue {
  // 参数序号
  parameterIndex: number;
  // 请求方式
  paramsType: ParamsType;
  // 参数名(切记，不是修饰的参数名，而是挂载在request上的属性)
  paramsKey: string;
}
