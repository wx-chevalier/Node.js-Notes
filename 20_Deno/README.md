# Deno

Deno 是一款通用的 JavaScript/TypeScript 编程环境。它汇集了许多最出色的开源技术，并使用一个很小的可执行文件提供了全面的解决方案。Deno 由 Ryan Dahl 创建，他最出名的头衔是 Node.js 的幕后策划者。Deno 充分利用了自 2009 年 Node.js 发布以来不断加强的 JavaScript 特性。它还解决了 Ryan 在他的“Node.js 令我感到遗憾的 10 件事”中谈到的设计缺陷。有些人称其为 Node.js 的续作，尽管作者本人并未提出这种主张。

与用 C++ 编写的 Node.js 不同，Deno 是用 Rust 编写的。它建立在 Tokio 平台之上，并且像 Node.js 一样使用 V8 引擎执行 JavaScript 代码。


- Rust 是由 Mozilla 主导开发的通用、编译型编程语言。设计准则为 “安全、并发、实用”，支持函数式、并发式、过程式以及面向对象的编程风格。Deno 使用 Rust 语言来封装 V8 引擎，通过 libdeno 绑定，我们就可以在 JavaScript 中调用隔离的功能。

- Tokio 是 Rust 编程语言的异步运行时，提供异步事件驱动平台，构建快速，可靠和轻量级网络应用。利用 Rust 的所有权和并发模型确保线程安全。Tokio 构建于 Rust 之上，提供极快的性能，使其成为高性能服务器应用程序的理想选择。在 Deno 中 Tokio 用于并行执行所有的异步 IO 任务。

- V8 是一个由 Google 开发的开源 JavaScript 引擎，用于 Google Chrome 及 Chromium 中。V8 在运行之前将JavaScript 编译成了机器代码，而非字节码或是解释执行它，以此提升性能。更进一步，使用了如内联缓存（inline caching）等方法来提高性能。有了这些功能，JavaScript 程序与 V8 引擎的速度媲美二进制编译。在 Deno 中，V8 引擎用于执行 JavaScript 代码。

