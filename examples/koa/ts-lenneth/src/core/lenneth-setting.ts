/**
 * 基础设置类
 */
import { IServerSettings, TImports, ILogFileSetting } from "@interfaces";
import { Env, Metadata } from "@common";
import { SERVER_SETTINGS } from "@constants";
import { Value } from "@decorators";
import { DebugController } from "./debug.controller";
import { LennethGlobalError } from "./lenneth-error";
import { LennethResponse } from "./lenneth-response";

// 根目录
const rootDir = process.cwd();
// 环境变量
const env = (process.env.NODE_ENV as Env) || Env.DEV;

export class LennethSetting implements IServerSettings {
  /**
   * 根目录
   */
  @Value(rootDir) rootDir: string;
  /**
   * 端口号
   */
  @Value(8080)
  port: string | number;
  /**
   * 环境变量
   */
  @Value(env) env: string;
  /**
   * API
   */
  @Value({ "/debug": DebugController })
  imports: TImports;
  /**
   * 错误处理
   */
  @Value(LennethGlobalError) globalError: Function;

  /**
   * 返回值处理
   */
  @Value(LennethResponse) response: Function;
  /**
   * 拦截器
   */
  interceptor: Function;

  // /**
  //  * 日志文件设置
  //  */
  logFileSetting: ILogFileSetting;

  /**
   * {
   *    imports,
   *    interceptor,
   *    debug,
   *    env
   * }
   */
  static serverSettingMap = new Map<string, any>();

  /**
   * 子类实例对象,这个是关键的方法，用来获取设置参数的
   * @param target
   */
  getMetadata(target: any) {
    return Metadata.getOwn(SERVER_SETTINGS, target);
  }

  /**
   * 设置字段
   * @param propertyKey
   * @param value
   */
  setMap(propertyKey: string | IServerSettings, value?: any): void {
    if (typeof propertyKey == "string") {
      LennethSetting.serverSettingMap.set(propertyKey, value);
    } else {
      let setting = {
        rootDir: this.rootDir,
        port: this.port,
        env: this.env,
        globalError: this.globalError,
        response: this.response,
        logFileSetting: this.logFileSetting,
        ...propertyKey
      };
      // imports 特殊处理
      let _imports = this.imports;
      let imports = setting["imports"];
      setting["imports"] = { ...imports, ..._imports };
      Object.keys(setting).forEach(key => {
        this.setMap(key, setting[key]);
      });
    }
  }

  /**
   * 构建端口
   * listion(port, '0.0.0.0', callback)
   */
  getHttpPort(): { hostname: string; port: string | number } {
    let hostname = "0.0.0.0";
    return { hostname, port: LennethSetting.serverSettingMap.get("port") };
  }
}
