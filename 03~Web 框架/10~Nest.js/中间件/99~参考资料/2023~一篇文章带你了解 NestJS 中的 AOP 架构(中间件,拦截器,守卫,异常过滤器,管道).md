> [原文地址](https://blog.csdn.net/xdididi/article/details/134932593)

# 一篇文章带你了解 NestJS 中的 AOP 架构(中间件,拦截器,守卫,异常过滤器,管道)

在介绍 AOP 架构之前我们需要先了解一下 NestJS 对一个请求的处理过程。在 NestJS 中,一个请求首先会先经过控制器（Controller）,然后 Controller 调用服务 (Service)中的方法,在 Service 中可能还会进行数据库的访问(Repository)等操作,最后返回结果。但是如果我们想在这个过程中加入一些通用逻辑,比如打印日志,权限控制等该如何做呢?这时候就需要用到 AOP(Aspect-Oriented Programming，面向切面编程)了,它允许开发者通过定义切面（Aspects）来对应用程序的各个部分添加横切关注点（Cross-Cutting Concerns）。横切关注点是那些不属于应用程序核心业务逻辑，但在整个应用程序中多处重复出现的功能或行为。这样可以让我们在不侵入业务逻辑的情况下来加入一些通用逻辑。

本篇文章将介绍 NestJS 中的五种实现 AOP 的方式(Middleware、Guard、Pipe、Interceptor、ExceptionFilter)

# Middleware(中间件)

Middleware(中间件)这个大家应该不陌生,在 express 中经常会用到,Middleware 在 NestJS 中与 Express 类似,它是用于处理 HTTP 请求和响应的功能模块。中间件可以在请求进入控制器之前或响应返回给客户端之前执行一些操作。

我们先创建一个 Nest 项目来演示 Middleware 的用法：

```sh
nest new test -p npm
```
