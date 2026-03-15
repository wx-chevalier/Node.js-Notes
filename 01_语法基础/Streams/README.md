# Node.js Streams

Stream（流）是 Node.js 中的基础概念，类似于 EventEmitter，专注于 IO 管道中事件驱动的数据处理方式；类比于数组或者映射，Stream 也是数据的集合，只不过其代表了不一定正在内存中的数据。流从最早的 Unix 时代就来到了我们身边，几十年来已经证明了自己是一种可靠的方式，可以将做得好的小组件组成大型系统。在 Unix 中，流是由 shell 用|管道实现的。在 node 中，内置的流模块被核心库使用，也可以被用户空间模块使用。与 Unix 类似，node 流模块的主要组成操作符叫做 .pipe()，你可以得到一个免费的背压机制，以节制慢速消费者的写入。

流可以帮助分离你的关注点，因为它们将实现表面的面积限制在一个可以重用的一致接口中。然后，你可以将一个流的输出插入到另一个流的输入，并使用对流进行抽象操作的库来建立更高级别的流控制。流是程序设计和 Unix 哲学的重要组成部分，但还有许多其他重要的抽象值得考虑。只要记住技术债务是敌人，并为眼前的问题寻求最好的抽象。

Node.js 的 Stream 分为以下类型：

- Readable Stream: 可读流，数据的产生者，譬如 process.stdin
- Writable Stream: 可写流，数据的消费者，譬如 process.stdout 或者 process.stderr
- Duplex Stream: 双向流，即可读也可写
- Transform Stream: 转化流，数据的转化者

Stream 本身提供了一套接口规范，很多 Node.js 中的内建模块都遵循了该规范，譬如著名的 `fs` 模块，即是使用 Stream 接口来进行文件读写；同样的，每个 HTTP 请求是可读流，而 HTTP 响应则是可写流。

![Node.js Streams 示意](https://s1.ax1x.com/2020/10/14/04qO5d.png)
