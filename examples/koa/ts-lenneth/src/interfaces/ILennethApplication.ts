import * as Koa from "koa";
import { IBaseInterface } from "./IBase.interface";
export interface ILennthApplication extends IBaseInterface {
  start(): Promise<any>;
  //init(): Promise<this>;
  use(middleware: Koa.Middleware): this;
  // listen(port: number | string, callback?: () => void): void;
  // listen(port: number | string, hostname: string, callback?: () => void): void;
}
