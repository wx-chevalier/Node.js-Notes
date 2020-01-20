# 数据访问

Nest 与数据库无关，可让您轻松地与任何 SQL 或 NoSQL 数据库集成。您可以根据自己的喜好选择多种选择。在最一般的级别上，将 Nest 连接到数据库仅是为数据库加载适当的 Node.js 驱动程序，就像使用 Express 或 Fastify 一样。您还可以直接使用任何通用的 Node.js 数据库集成库或 ORM（例如 Sequelize，Knex.js（教程）和 TypeORM 来进行更高级别的抽象。

为了方便起见，Nest 还使用 `@nestjs/typeorm` 与现成的 TypeORM 紧密集成，这将在本章中介绍，而 Mongoose 与 `@nestjs/mongoose` 进行了本章介绍。这些集成提供了其他 NestJS 特定的功能，例如模型/存储库注入，可测试性和异步配置，以使访问所选数据库更加容易。
