import * as originalMulter from "koa-multer";
export interface IMulterOptions {
  options?: originalMulter.Options;
  single?: string;
}
