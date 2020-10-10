/**
 * 路由基本方法
 * @Controller("/user")
 * class UserController{
 *    @Router({
 *        method: 'get',
 *        path: '/list'
 *    })
 *    async getUserList(){
 *    }
 * }
 */
import { IRouterParams, PathOrParamsType } from "@interfaces";
import { RouterService } from "@services";
export const Router = (params: IRouterParams): Function => {
  return (target: any, name: string, descriptor: ParameterDecorator) => {
    RouterService.DecoratedRouters.set(
      {
        target,
        name,
        ...params
      },
      target[name]
    );
  };
};

export const Get = (path: string): Function => {
  return Router({ method: "GET", path });
};

export const Post = (path: string): Function => {
  return Router({ method: "POST", path });
};

export const Put = (path: string): Function => {
  return Router({ method: "PUT", path });
};

export const Delete = (path: string): Function => {
  return Router({ method: "DELETE", path });
};
