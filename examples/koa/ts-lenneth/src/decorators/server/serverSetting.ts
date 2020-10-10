import { SERVER_SETTINGS } from "@constants";
import { IServerSettings } from "@interfaces";
import { Metadata } from "@common";
/**
 * 服务启动配置项
 * @param settings
 */
export const ServerSettings = (settings: IServerSettings): ClassDecorator => {
  return (target: any) => {
    Metadata.set(SERVER_SETTINGS, settings, target);
  };
};
