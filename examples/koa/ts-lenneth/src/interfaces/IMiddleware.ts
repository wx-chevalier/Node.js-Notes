import { IBaseInterface } from "./IBase.interface";
export interface IMiddleware extends IBaseInterface {
  use(...args: any[]): void | any | Promise<any>;
}
