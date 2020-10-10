### lenneth(蕾娜斯)

> 说明

封装 lenneth 旨在快速方便的搭建出一个 node web 应用，不过度封装也不随波逐流，koa 的 node 是简单的，lenneth 也是。

基于 ES6+typescript 的一些特性，做了一些类似 spring 的注解，对开发本身不增加复杂度，并且不失 koa 的灵活性。
lenneth 内部已经集成了 koa, koa-bodyparser, koa-router 这 3 个基础库，已经满足了大部分的开发，如果需要引入其他的中间件，可以在入口文件中引入。

lenneth 抽象了 3 个模块，分别是 controller,middleware,service，内部不接入任何 db 和 cache。

> 安装

```bash
yarn add lenneth
# or
npm install lenneth
```

也可以客户端安装

```bash
# lic 全局安装
npm install -g lenneth-cli

# 初始化工程目录
lenneth init yourApp
```

> 瞄一眼

```javascript
import { LennethApplication, ServerSettings, ILenneth } from "lenneth";

@ServerSettings({
  port: 8081
})
class App extends LennethApplication implements ILenneth {
  $onMountingMiddlewares() {
    this.use(async (ctx, next) => {
      ctx.body = "hello world";
    });
  }
}

new App().start();
```

open in browser

```
http://localhost:8081
```

> lenneth 核心

koa 最精髓的就是它的洋葱模型，而洋葱模型的元素就是一个一个的中间件，lenneth 的封装就是将普通的类方法转化成 koa 的中间件

```javascript
  /**
   * koa中间件，有两个参数
   * @params ctx 上下文
   * @params next 洋葱模型执行下一个中间件
   */
  async (ctx, next) => {

  }

  /**
   * 这个类方法并不是koa的中间件
   * 按照设计思路，类方法的两个参数一个是获取path参数，一个是获取返回对象，和koa的中间件参数不同
   */
  @Get("/detail/:id")
  @UseBefore(UserRuleAuth)
  async getUserDetail(
    @PathVariable("id") id: string,
    @Response() response: TResponse
  ) {
    response.body = this.userService.getUserById(id);
  }
```

转换函数

这个方法就是将上述的类方法转成 koa 的中间件。在类方法的上层封装了一个 koa 的中间件方法，在这个方法内部自动执行类方法，并将这个方法的 this 指向原来的类。

```javascript
// lenneth封装koa2的核心
const toAsyncMiddleware = (
  target: Object | any,
  middleware: TApiMiddleware,
  key?: string,
  cb?: (key: string, ctx: IContext, next: TNext) => any[]
) => {
  return async (ctx: IContext, next: TNext) => {
    if (key) {
      // 此处一定要用call来重新设置this指向
      return middleware.call(target, ...cb(key, ctx, next), ctx, next);
    }
    return middleware.call(target, ctx, next);
  };
};
```

> 各个模块

- application

入口文件处，使用 ServerSettings 修饰，里面的参数都是一些全局方法，如 interceptor，response 等，这些都是一个 middleware，lenneth 只是依照 koa 的洋葱模型调整了他们的执行顺利

```javascript
@ServerSettings({
  port: 8081,
  // controller
  imports: {
    "/apis": UserController
  },
  // 拦截器
  interceptor: Interceptor,
  // 返回值封装
  response: AppResponse,
  // error事件捕获
  globalError: GlobalError
})
class App extends LennethApplication implements ILenneth {
  $onMountingMiddlewares() {
    this.use(logger());
  }
}
```

- interceptor

其实也是一个中间件，只不过在最前执行

```javascript
import { IMiddleware, Middleware, HeaderParams, Next, TNext } from "lenneth";

@Middleware()
export class Interceptor implements IMiddleware {
  async use(@HeaderParams() header: any, @Next() next: TNext) {
    console.log("Interceptor", header);
    await next();
  }
}
```

- response

中间件，在最后执行，默认开启，可以覆盖

```javascript
import { IMiddleware, IContext, TResponse, TNext } from "@interfaces";
import { Middleware, Response, Next } from "@decorators";
import { HttpStatus, ResponseStatus } from "@common";
import { LennethError } from "./Lenneth-error";
@Middleware()
export class LennethResponse implements IMiddleware {
  async use(
    @Response() response: TResponse,
    @Next() next: TNext,
    ctx: IContext
  ) {
    try {
      // 执行前面所有的中间件
      await next();
      // 统一处理返回
      if (response.body) {
        return (response.body = {
          code: 0,
          message: ResponseStatus.SUCCESS,
          data: response.body
        });
      }
      return (response.body = { code: 0, message: ResponseStatus.SUCCESS });
    } catch (err) {
      ctx.status = err.code;
      response.status = HttpStatus.OK;
      if (err instanceof LennethError) {
        response.body = {
          code: err.code,
          message: err.message || ResponseStatus.ERROR
        };
      } else {
        response.body = {
          code: err.code || HttpStatus.INTERNAL_SERVER_ERROR,
          message: err.message || ResponseStatus.ERROR
        };
        // 未识别错误 抛至最外层error全局处理
        throw err;
      }
    }
  }
}
```

- controller

controller 主要是设置 router 和注入 services

router 的修饰器有 Post,Get 等,params 参数的获取同 spring，注入 service 使用修饰器 Autowired,这个也和 spring 一致

```javascript
import {
  Controller,
  Autowired,
  Post,
  Get,
  RequestBody,
  PathVariable,
  Response,
  TResponse,
  UseBefore,
  Description
} from "lenneth";
import { UserService } from "../services";
import { IUserInfo } from "../interface";
import { UserAuth, RuleAuth } from "../middleware";

@Controller("/user")
export class UserController {
  @Autowired()
  userService: UserService;

  @Post("/add")
  @Description("添加会员")
  @UseBefore(UserAuth, RuleAuth)
  async addUser(
    @RequestBody() user: IUserInfo,
    @Response() response: TResponse
  ) {
    response.body = this.userService.addUser(user);
  }

  @Get("/detail/:userId")
  @UseBefore(UserAuth)
  @Description("查询会员")
  async getUser(
    @PathVariable("userId") userId: string,
    @Response() response: TResponse
  ) {
    response.body = this.userService.getUserInfo(userId);
  }
}
```

- middleware

middleware 本质上其实就是 koa 的中间件，只不过我在此基础上又抽象出一层方法来引入获取 params 的方法，用来方便开发

在 controller 每个 api 上，使用 UseBefore 修饰器即可使用这些 middleware，在运行期，middleware 先于 controller 定义的接口，如果 middleware 没有调用 next 函数，则不会调用下一个中间件(kao 洋葱模型)

```javascript
import { IMiddleware, Middleware, Next, TNext, HeaderParams } from "lenneth";

@Middleware()
export class UserAuth implements IMiddleware {
  async use(@HeaderParams() headers: any, @Next() next: TNext) {
    await next();
  }
}

@Middleware()
export class RuleAuth implements IMiddleware {
  async use(@HeaderParams() headers: any, @Next() next: TNext) {
    await next();
  }
}
```

- service

这个模块只是做一个类输出方法

```javascript
export class UserService {
  addUser(userInfo: IUserInfo) {
    return userInfo;
  }

  getUserInfo(id: string) {
    return {
      name: "zhangsan",
      age: 30
    };
  }
}
```

> 单元测试

```bash
yarn test
```

> 案例

[lenneth-demo](https://github.com/soraping/lenneth-demo)

> 项目地址

[lenneth](https://github.com/soraping/lenneth)

> 脚手架工具

[lenneth-cli](https://github.com/soraping/lenneth-cli)

> 说在最后

当初做项目的时候，在 github 上搜过一个项目，是基于 express 的--[ts-express-decorators](https://github.com/Romakita/ts-express-decorators)，里面有很多不错的设计，lenneth 里的服务启动生命周期就是照搬其中的。不过我不喜欢把 node 弄得那么大，那么全，而且，koa 本身就是一个极简的应用，所以，lenneth 仅仅只是做了一层封装，繁简自然。
