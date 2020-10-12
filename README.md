[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/wx-chevalier/Node-Series">
    <img src="https://s2.ax1x.com/2020/01/15/lLHrpq.png" alt="Logo" width="150" height="80">
  </a>

  <h3 align="center">深入浅出 Node.js 全栈架构</h3>

  <p align="center">
    <br />
    <a href="https://ng-tech.icu/Node-Series"><strong>在线阅读 >> </strong></a>
    <br />
    <br />
    <a href="https://github.com/wx-chevalier/Node-Series">速览手册</a>
    ·
    <a href="https://github.com/wx-chevalier/Node-Series/issues">Report Bug</a>
    ·
    <a href="https://github.com/wx-chevalier/Node-Series/issues">参考资料</a>

  </p>
</p>

# Introduction

Node.js 为前端开发者开拓了更广阔的应用空间，前端和后端开发的一种语言和技术，以及出色的性能; 但是没有并发和繁重的 CPU 处理问题，以及高级数据库抽象。

## NodeJS 的潜在缺陷探讨

- 在虚拟机层面 node.js 基于的 v8 VM 看起来很不错，但和 Java 的 VM 一比，差距甚远。在服务器领域，特别是拥有众多 CPU 和大量内存的环境下，Java 的 VM 几乎是你能在地球上找到的最好的 VM。而 v8 既不能充分利用多 CPU 的性能，也不能将内存充分利用。你唯一能做的事情就是开很多个 node.js 实例来缓解，但这进一步带来了更多的问题。

- 在语言层面 JavaScript 本身的设计让你感觉很灵活，因为它基本上是不对类型进行约束的，只有当运行过程中发生了错误才会提示你，毕竟在浏览器环境内，这算不上什么问题；但在一个团队内进行协作时，你会深刻的明白类型系统如果能在运行前就帮你找出那些低级的类型错误问题，将会节省你多少的时间和金钱。特别是别忘了，系统总是在演进的，一个稍微复杂些的业务系统就拥有几十个乃至上百个类型，而类型修改又往往很频繁，想想这个过程里会发生些什么你就明白了。

- 在领域应用层面 node.js 在 Web 开发领域特别是其中的前端部分已经达到了惊人的繁荣程度，甚至有不少重要系统的后端部分也基于 node.js 完成。但如果仅凭这些就轻易的认为 node.js 将会一统全栈打败包括 Java 在内的其它语言是很幼稚的。首先，在一个大型的系统架构中，整个系统是拆分成很多很小的业务系统的，这些系统往往通过消息队列(如 RabbitMQ、Kafka 等等)相互连接起来。也许在小型 Web 站点中，你从来没用过这些。但相信我，在但凡稍微大一些的业务系统中，都是这么干的。这些消息队列服务存在的理由就是将各个子系统解耦。这样一来，你可以在前端部分应用 node.js 进行快速开发，在业务处理部分使用 Java 来完成。数据分析系统却可以使用 Python/Scala (例如基于 Spark)实现。大型业务系统的架构者们都是些经验丰富的老手，他们知道每个语言/系统的利弊，也知道世界总在变，今天是 node.js、明天也许就是另一个新秀，因此在整个业务系统中，你要做的根本不是“统一”，反而是“分离”。这样的设计才能够预留出扩展和变更的机会。

# Nav | 导读

本书的精排目录导航版请参考 [https://ng-tech.icu/Node-Series](https://ng-tech.icu/Node-Series)，更多 Web 开发相关请参阅《[现代 Web 全栈开发与工程架构](https://ngte-web.gitbook.io/i/)》。

# About | 关于

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Copyright & More | 延伸阅读

笔者所有文章遵循[知识共享 署名 - 非商业性使用 - 禁止演绎 4.0 国际许可协议](https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh)，欢迎转载，尊重版权。您还可以前往 [NGTE Books](https://ng-tech.icu/books/) 主页浏览包含知识体系、编程语言、软件工程、模式与架构、Web 与大前端、服务端开发实践与工程架构、分布式基础架构、人工智能与深度学习、产品运营与创业等多类目的书籍列表：

[![NGTE Books](https://s2.ax1x.com/2020/01/18/19uXtI.png)](https://ng-tech.icu/books/)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/wx-chevalier/Node-Series.svg?style=flat-square
[contributors-url]: https://github.com/wx-chevalier/Node-Series/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/wx-chevalier/Node-Series.svg?style=flat-square
[forks-url]: https://github.com/wx-chevalier/Node-Series/network/members
[stars-shield]: https://img.shields.io/github/stars/wx-chevalier/Node-Series.svg?style=flat-square
[stars-url]: https://github.com/wx-chevalier/Node-Series/stargazers
[issues-shield]: https://img.shields.io/github/issues/wx-chevalier/Node-Series.svg?style=flat-square
[issues-url]: https://github.com/wx-chevalier/Node-Series/issues
[license-shield]: https://img.shields.io/github/license/wx-chevalier/Node-Series.svg?style=flat-square
[license-url]: https://github.com/wx-chevalier/Node-Series/blob/master/LICENSE.txt
