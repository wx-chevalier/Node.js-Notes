import { PathOrParamsType } from "./PathParamsType";
export interface IController {
  [key: string]: any;
}

export interface IRouterPathConfig {
  // 目标类
  target: any;
  // 请求方式
  method: string;
  // 路由path路径
  path: PathOrParamsType;
  // 类方法
  name: string;
}
