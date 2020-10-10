import { IBaseInterface } from "./IBase.interface";

export interface ILogTableSettings {
  padding?: number;
  header?: {
    [key: string]: string;
  };
}

export interface ILoggerService extends IBaseInterface {
  info(msg: any): void;
  debug(msg: any): void;
  error(msg: any): void;
  warn(msg: any): void;
  drawTable(list: any[], ILogTableSettings): string;
}
