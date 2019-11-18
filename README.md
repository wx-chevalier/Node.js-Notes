[![](https://i.postimg.cc/WzXsh0MX/image.png)](https://github.com/wx-chevalier/Backend-Series)

# 测试与高可用保障

QoS(Quality of Service)，顾名思义，QoS 就是服务质量的缩写。QoS 概念最初源于网络，指一个网络利用各种基础技术，提供更好网络通信服务能力, 是网络的一种安全保障机制，是用来解决网络延迟和阻塞等问题的一种技术。但是，如今 QoS 概念已经被范化，不仅用于网络，也用来标识应用服务、基础技术、资源保障的能力和质量。

高可用架构并非基础架构本身，而是涵盖了多个维度，为了保障最终交付/部署可用性的策略、机制、技术架构的集合。质量保障应该是从团队组织，到开发，测试，发布，运维等全生命周期的工作，而不是某个孤立的技术突破点。

![mindmap](https://i.postimg.cc/zDK3YzGQ/image.png)

# 面向失败的设计

软件架构也发生了一系列变化，从面向功能的单一系统架构，分布式架构，到面向业务的中台化架构，到现在的面向生态的云化架构。云化架构为我们带来了开放的生态，允许我们与更多的团队、更多的技术栈协同工作，但也带来了更多的不可控。因此在云时代，传统软件架构思想原则基础上，面向失败的架构设计也愈发越来越重要。

软件工程师通常会对这三个方面进行优化：可用性、性能、容错能力。

- 可用性：系统正常响应和避免停机的能力。
- 性能：在这里特指对延迟或资源成本的最小化。
- 容错能力：系统从非正常状态中恢复的能力。

对于失败的定义，在上面三个维度也是有所不同，而如果以面向对象、功能或者业务视角来看，又是另一类维度的划分。抽象来说，面向失败的设计，就是假设系统必然会发生失败，天然为了失败而存在的，贯穿于软件整个生命周期的设计思想。譬如我们在设计阶段，就假设线上系统会出问题，从而在管控系统添加相应措施来防止一旦系统出现某种情况，可以及时补救。面向失败的设计思想的一个基石就是将监控、告警、管控系统作为系统基石的一部分，在设计阶段即融于整体。

- 简单化设计原则：系统架构简单清晰，具备水平扩展能力 。与之相反的就是过度设计，如何更好的平衡必要复杂度与意外复杂度是关键；不是在不能添加更多的时候，而是没有什么可以去掉的时候，才能达到完美。

- 监控设计原则：监控系统架构及监控规则应该是简单的，易于理解的。监控项覆盖度高，需要控制好有效报警数，监控围绕四大黄金指标：延迟，流量，错误，饱和度展开。

- 管控设计原则：需避免权限过大，系统应具备逃生能力，灰度能力。线上很多故障发生，都是因为权限过大或者不具备灰度能力导致的。管控系统作为服务提供方，理应当对自身行为带来的危害负责，需要具备自保护能力。

- 敏捷设计原则：敏捷开发，小规模，多批次迭代。敏捷开发对面向失败设计来说可以有效预防，降低故障发生，同时能够快速定位及恢复故障。

- 变更设计原则：可灰度，可监控，可回滚。无论系统发布还是配置项的改动，都需要遵从变更三板斧。线上 60% 故障是由于变更发布导致的，渐进式发布，快速准确检测到问题，同时快速回滚是非常必要的。

- 容量设计原则：基于稳态容量及尖刺容量规划，适当冗余，具备快速弹性扩容能力。通过自然需求增长模型来预测稳态容量，通过适当冗余，流控，快速弹性扩容能力保障非自然需求增长。同时做好周期性压力测试。

- 依赖设计原则：最小化依赖，避免循环依赖，通过异步化，服务降级，限流，隔离等手段控制由于依赖带来的影响面。上下游依赖需要建立基于接口，服务，应用等级别的 SLO，了解更多上下游信息，做好防护手段。

- 自动化设计原则：对重复，人肉的操作尽可能通过自动化来保障操作一致性，提升效率。

- 快恢设计原则：标准化的故障恢复流程， 从故障被监控发现开始，人员上线响应，故障定位 ，恢复等一系列流程是人与系统共同参与的活动。从人的角度需要具备 oncall 能力，快速上线能力，快速登录系统定位处理问题能力，系统需要具备快速报警，回滚，隔离，容灾等能力。

# 高并发应对

高并发系统的典型场景就是电商大促、12306 抢票等，瞬间洪峰超出最大负载，热点商品、票仓挤占正常流量，导致 CPU LOAD 居高不下，请求响应缓慢而损害用户体验。高并发场景下的挑战，首先是继承了我们在并发编程中讨论的挑战点，譬如共享资源的并发访问，计算型密集任务的分布式调度等。

在本篇的高并发应对中，我们核心是关注于单一热点资源的峰值流量的架构与策略，对于分布式计算、调度等相关内容，我们将会在[分布式基础架构](https://ngte-infras.gitbook.io/i/)系列中进行详细地讨论。

# 自动化运维

在 [DevOps 篇](https://ngte-be.gitbook.io/i/devops)中我们详细讨论了运维的方法论、运维体系的搭建；本小节则再具体从自动化运维的角度，阐述其对于高可用保障的重要意义。

# About

## 版权

![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)
![](https://parg.co/bDm)

笔者所有文章遵循 [知识共享 署名-非商业性使用-禁止演绎 4.0 国际许可协议](https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh)，欢迎转载，尊重版权。如果觉得本系列对你有所帮助，欢迎给我家布丁买点狗粮(支付宝扫码)~

![default](https://i.postimg.cc/y1QXgJ6f/image.png)

## Home & More | 延伸阅读

![技术视野](https://s2.ax1x.com/2019/09/30/uJWQTx.jpg)

您可以通过以下导航来在 Gitbook 中阅读笔者的系列文章，涵盖了技术资料归纳、编程语言与理论、Web 与大前端、服务端开发与基础架构、云计算与大数据、数据科学与人工智能、产品设计等多个领域：

- 知识体系：《[Awesome Lists | CS 资料集锦](https://ngte-al.gitbook.io/i/)》、《[Awesome CheatSheets | 速学速查手册](https://ngte-ac.gitbook.io/i/)》、《[Awesome Interviews | 求职面试必备](https://github.com/wx-chevalier/Awesome-Interviews)》、《[Awesome RoadMaps | 程序员进阶指南](https://github.com/wx-chevalier/Awesome-RoadMaps)》、《[Awesome MindMaps | 知识脉络思维脑图](https://github.com/wx-chevalier/Awesome-MindMaps)》、《[Awesome-CS-Books | 开源书籍（.pdf）汇总](https://github.com/wx-chevalier/Awesome-CS-Books)》

- 编程语言：《[编程语言理论](https://ngte-pl.gitbook.io/i/)》、《[Java 实战](https://github.com/wx-chevalier/Java-Series)》、《[JavaScript 实战](https://github.com/wx-chevalier/JavaScript-Series)》、《[Go 实战](https://ngte-pl.gitbook.io/i/go/go)》、《[Python 实战](https://ngte-pl.gitbook.io/i/python/python)》、《[Rust 实战](https://ngte-pl.gitbook.io/i/rust/rust)》

- 软件工程、模式与架构：《[编程范式与设计模式](https://ngte-se.gitbook.io/i/)》、《[数据结构与算法](https://ngte-se.gitbook.io/i/)》、《[软件架构设计](https://ngte-se.gitbook.io/i/)》、《[整洁与重构](https://ngte-se.gitbook.io/i/)》、《[研发方式与工具](https://ngte-se.gitbook.io/i/)》

* Web 与大前端：《[现代 Web 全栈开发与工程架构](https://ngte-web.gitbook.io/i/)》、《[数据可视化](https://ngte-fe.gitbook.io/i/)》、《[iOS](https://ngte-fe.gitbook.io/i/)》、《[Android](https://ngte-fe.gitbook.io/i/)》、《[混合开发与跨端应用](https://ngte-fe.gitbook.io/i/)》

* 服务端开发实践与工程架构：《[微服务与云原生](https://ngte-be.gitbook.io/i/)》、《[测试与高可用保障](https://ngte-be.gitbook.io/i/)》、《[DevOps](https://ngte-be.gitbook.io/i/)》、《[Spring](https://github.com/wx-chevalier/Spring-Series)》、《[信息安全与渗透测试](https://ngte-be.gitbook.io/i/)》

* 分布式基础架构：《[分布式系统](https://ngte-infras.gitbook.io/i/)》、《[分布式计算](https://ngte-infras.gitbook.io/i/)》、《[数据库](https://github.com/wx-chevalier/Database-Series)》、《[网络](https://ngte-infras.gitbook.io/i/)》、《[虚拟化与云计算](https://github.com/wx-chevalier/Cloud-Series)》、《[Linux 与操作系统](https://github.com/wx-chevalier/Linux-Series)》

* 数据科学，人工智能与深度学习：《[数理统计](https://ngte-aidl.gitbook.io/i/)》、《[数据分析](https://ngte-aidl.gitbook.io/i/)》、《[机器学习](https://ngte-aidl.gitbook.io/i/)》、《[深度学习](https://ngte-aidl.gitbook.io/i/)》、《[自然语言处理](https://ngte-aidl.gitbook.io/i/)》、《[工具与工程化](https://ngte-aidl.gitbook.io/i/)》、《[行业应用](https://ngte-aidl.gitbook.io/i/)》

* 产品设计与用户体验：《[产品设计](https://ngte-pd.gitbook.io/i/)》、《[交互体验](https://ngte-pd.gitbook.io/i/)》、《[项目管理](https://ngte-pd.gitbook.io/i/)》

* 行业应用：《[行业迷思](https://github.com/wx-chevalier/Business-Series)》、《[功能域](https://github.com/wx-chevalier/Business-Series)》、《[电子商务](https://github.com/wx-chevalier/Business-Series)》、《[智能制造](https://github.com/wx-chevalier/Business-Series)》

此外，你还可前往 [xCompass](https://wx-chevalier.github.io/home/#/search) 交互式地检索、查找需要的文章/链接/书籍/课程；或者在 [MATRIX 文章与代码索引矩阵](https://github.com/wx-chevalier/Developer-Zero-To-Mastery)中查看文章与项目源代码等更详细的目录导航信息。最后，你也可以关注微信公众号：『**某熊的技术之路**』以获取最新资讯。
