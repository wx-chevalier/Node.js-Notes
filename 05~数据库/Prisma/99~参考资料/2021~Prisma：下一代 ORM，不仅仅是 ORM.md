> [原文地址](https://juejin.cn/post/6973277530996342798)，你提供的链接是一篇关于 Prisma 的文章，标题为“Prisma：下一代 ORM，不仅仅是 ORM（上篇）”。以下是文章的主要内容概>述：
>
> ### 前言
>
> - 文章介绍了 Prisma，一个在 NodeJS 社区中备受关注的 ORM（对象关系映射）工具。
> - 作者对 Prisma 的未来发展充满信心，并计划将文章分为两部分：基础介绍和进阶使用。
>
> ### NodeJS 社区中的 ORM
>
> - 介绍了 NodeJS 社区中常用的 ORM 工具，包括 Sequelize、TypeORM、MikroORM、Mongoose、Typegoose 和 Bookshelf。
> - 每个 ORM 工具都有其独特的特点和使用方式。
>
> ### ORM 的 Data Mapper 与 Active Record 模式
>
> - 解释了 Data Mapper 和 Active Record 两种模式的区别。
> - 展示了 TypeORM 中如何使用这两种模式。
>
> ### Query Builder
>
> - 介绍了 Query Builder 的概念及其与传统 ORM 的不同之处。
> - 展示了 TypeORM 和 knex 的 Query Builder 的使用示例。
>
> ### Prisma
>
> - Prisma 被定义为 NodeJS 的 ORM，但其功能比普通 ORM 更强大。
> - Prisma 使用独特的 Schema 定义方式，生成的类型定义比 TypeORM 更全面。
> - Prisma 提供了更全面的操作符，如字符串的 contains、startsWith、endsWith 等。
>
> ### Prisma 的使用流程
>
> - 创建一个名为`prisma`的文件夹，并在其中创建`schema.prisma`文件。
> - 定义数据库类型、路径以及数据库表结构。
> - 运行`prisma generate`命令生成 Prisma Client。
> - 在项目中导入并使用 Prisma Client。
>
> ### 项目初始化
>
> - 创建空文件夹并初始化 npm 项目。
> - 全局安装`@prisma/cli`。
> - 安装必要的依赖，如`@prisma/client`、`sqlite3`、`prisma`等。
>
> ### 创建数据库
>
> - 修改 Prisma Schema 中的数据库类型为 SQLite。
> - 运行`prisma db push`创建数据库文件。
>
> ### 客户端生成与使用
>
> - 执行`prisma generate`生成 Prisma Client。
> - 创建`index.ts`文件并使用 Prisma Client 进行数据库操作。
>
> ### Prisma 单表初体验
>
> - 介绍了如何在 Prisma 中进行 CRUD 操作（创建、读取、更新、删除）。
>
> ### 尾声 & 下篇预告
>
> - 文章结尾预告了下篇内容，将介绍 Prisma 的多表级联关系处理、多个 Prisma Client 协作、Prisma 与其他 ORM 的协作、Prisma 与 GraphQL 的实战以及 Prisma 的展望。
>
> 这篇文章详细介绍了 Prisma 的基本概念、使用方式以及与其他 ORM 工具的比较，适合对 Prisma 感兴趣的开发者阅读。
