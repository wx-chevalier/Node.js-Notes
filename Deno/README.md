# Deno

Deno 是一款通用的 JavaScript/TypeScript 编程环境。它汇集了许多最出色的开源技术，并使用一个很小的可执行文件提供了全面的解决方案。Deno 由 Ryan Dahl 创建，他最出名的头衔是 Node.js 的幕后策划者。Deno 充分利用了自 2009 年 Node.js 发布以来不断加强的 JavaScript 特性。它还解决了 Ryan 在他的“Node.js 令我感到遗憾的 10 件事”中谈到的设计缺陷。有些人称其为 Node.js 的续作，尽管作者本人并未提出这种主张。

与用 C++ 编写的 Node.js 不同，Deno 是用 Rust 编写的。它建立在 Tokio 平台之上，并且像 Node.js 一样使用 V8 引擎执行 JavaScript 代码。它的一项出众特性是内置了 TypeScript。尽管它仍需要编译为 JavaScript 才能运行，但这是在内部完成的，因此对用户来说 TypeScript 的行为就好像它是原生支持的一样。

# 特性

## 安全性

默认情况下，Deno 是安全的。相比之下，Node.js 拥有对文件系统和网络的完全访问权限。要在没有权限的情况下运行程序，请使用：

deno run file-needing-to-run-a-subprocess.ts

如果代码需要权限设置，则会提醒你。

error: Uncaught PermissionDenied: access to run a subprocess, run again with the --allow-run flag

Deno 使用命令行选项来显式许可访问系统的各个部分。最常用的包括：环境访问
网络访问，文件系统读 / 写访问，运行一个子进程，要查看权限示例的完整列表，请输入 deno run -h。

这里的最佳实践是在 read、write 和 net 上使用权限白名单。这样你就可以更清楚地了解 Deno 被允许访问哪些内容。例如，要允许 Deno 在 /etc 目录中只读文件，请使用：deno --allow-read=/etc

## 标准库

Deno 标准库是由 Deno 项目维护，并保证可用于 Deno 的常用模块集合。它涵盖了用户最常用的常见任务代码，并且是基于 Go 编程语言提供的标准库。JavaScript 一直以来困扰用户的一个问题就是缺乏标准库。用户被迫一次又一次地重新发明轮子，开发人员不得不经常在 npm 上搜索第三方模块，以解决本应由平台制造商解决的常见问题。

React 之类的库可以解决很多复杂问题，这些第三方包很好用。但是对于 UUID 生成等简单的事情来说，我们最好使用官方的标准库。这些小型库可作为大型库的构建块，从而加快了开发速度并减少了开发人员的负担。曾一度流行的库被遗弃，留给用户自己维护或者需要用户找一个替代品的事情时有发生。

## 内置 TypeScript

TypeScript 是添加了显式类型的 JavaScript。任何有效的 JavaScript 代码也是有效的 TypeScript 代码，因这个将你的代码转换为 TypeScript 是非常容易的。只需将扩展名更改为.ts 并开始添加类型即可。

要在 Deno 中使用 TypeScript 无需执行任何操作。没有 Deno 时，必须将 TypeScript 编译为 JavaScript 才能运行。Deno 会在内部为你完成这个步骤，让 TypeScript 更容易上手。

## 尽可能使用 Web 标准

创建一个 Web 标准需要很长时间，但一旦标准被确定下来，我们就不应该忽略它。虽然框架来来去去，但 Web 标准是会长期存在的。花费在学习标准化 API 上的时间永远不会白费，因为没有人敢于破坏 Web；它可能已经使用了数十年，甚至可能在你剩下的职业生涯中一直发光发热。

fetch 这个 Web API 提供了用于提取资源的接口。浏览器中有一个 JavaScript fetch() 方法。如果你想在 Node.js 中使用这个标准，则需要使用第三方库 Node Fetch。在 Deno 中它是内置的，并且就像浏览器版本一样开箱即用。

## ECMAScript 模块

相比 Node.js，Deno 的一项主要进步是它使用了官方的 ECMAScript 模块标准，而不是老式的 CommonJS。Node.js 直到 2019 年底才在 13.2.0 版本中启用 ECMAScript 模块，但支持还是不够成熟，并且仍然包含有争议的.mjs 文件扩展名。

Deno 在模块系统中使用了现代 Web 标准，从而避免了旧时代的影响。模块使用 URL 或文件路径引用，并包含必需的文件扩展名。例如：

```
import * as log from "https://deno.land/std/log/mod.ts";
import { outputToConsole } from "./view.ts";
```