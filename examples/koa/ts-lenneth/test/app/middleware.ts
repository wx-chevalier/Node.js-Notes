import {
  Middleware,
  IMiddleware,
  HeaderParams,
  Next,
  TNext,
  RequestBody,
  LennethError
} from "../../lib";

import { IUserInfo } from "./interface";
const data = require("./data");

@Middleware()
export class UserRuleAuth implements IMiddleware {
  async use(@HeaderParams() headers: any, @Next() next: TNext) {
    if (headers["auth"] == "admin") {
      return await next();
    }
    throw new LennethError({
      code: 403,
      message: "没有权限"
    });
  }
}

@Middleware()
export class UserAddAuth implements IMiddleware {
  async use(@RequestBody() userInfo: IUserInfo, @Next() next: TNext) {
    if (
      !data["userList"].find((user: IUserInfo) => user.name == userInfo.name)
    ) {
      return await next();
    }
    throw new LennethError({
      code: 403,
      message: "name 重名"
    });
  }
}
