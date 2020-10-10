import { IBaseInterface } from "./IBase.interface";
import { ILogFileSetting } from "./ILogFileSetting";

export type TImports = { [path: string]: Function[] | Function };

export interface IServerSettings extends IBaseInterface {
  // 根目录
  rootDir?: string;
  // 监听端口
  port?: string | number;
  // api
  imports?: TImports;
  // 拦截器
  interceptor?: Function;
  // 全局错误处理error middleware
  globalError?: Function;
  // 全局处理返回值 response middleware
  response?: Function;
  // 环境变量
  env?: string;
  // log file 设置
  logFileSetting?: ILogFileSetting;
  [key: string]: any;
}
