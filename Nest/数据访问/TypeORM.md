# Nest.js 中的数据库操作

为了与 SQL 和 NoSQL 数据库集成，Nest 提供了@ nestjs / typeorm 软件包。Nest 使用 TypeORM，因为它是 TypeScript 可用的最成熟的对象关系映射器（ORM）。由于它是用 TypeScript 编写的，因此可以与 Nest 框架很好地集成。

要开始使用它，我们首先安装所需的依赖项。在本章中，我们将演示如何使用流行的 MySQL Relational DBMS，但是 TypeORM 提供了对许多关系数据库的支持，例如 PostgreSQL，Oracle，Microsoft SQL Server，SQLite，甚至是 NoSQL 数据库，例如 MongoDB。对于 TypeORM 支持的任何数据库。

```ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "root",
      database: "test",
      entities: [],
      synchronize: true
    })
  ]
})
export class AppModule {}
```

forRoot() 方法从 TypeORM 包接受与 createConnection() 相同的配置对象。另外，我们可以在项目根目录中创建 ormconfig.json 文件，而不是将配置对象传递给 forRoot() 。

```json
{
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "root",
  "password": "root",
  "database": "test",
  "entities": ["dist/**/*.entity{.ts,.js}"],
  "synchronize": true
}
```

然后在 forRoot 中不传入任何参数：

```ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forRoot()]
})
export class AppModule {}
```

TyperOrm 也支持异步配置：

```ts
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    type: "mysql",
    host: configService.getString("HOST"),
    port: configService.getString("PORT"),
    username: configService.getString("USERNAME"),
    password: configService.getString("PASSWORD"),
    database: configService.getString("DATABASE"),
    entities: [__dirname + "/**/*.entity{.ts,.js}"],
    synchronize: true
  }),
  inject: [ConfigService]
});
```

# 数据查询

完成此操作后，TypeORM Connection 和 EntityManager 对象将可用于在整个项目中注入（而无需导入任何模块），例如：

```ts
import { Connection } from "typeorm";

@Module({
  imports: [TypeOrmModule.forRoot(), PhotoModule]
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
```

## Repository

TypeORM 支持存储库设计模式，因此每个实体都有自己的存储库。这些存储库可以从数据库连接中获取，首先在 Module 中需要声明依赖：

```ts
@Module({
  imports: [TypeOrmModule.forFeature([Photo])],
  providers: [PhotoService],
  controllers: [PhotoController]
})
export class PhotoModule {}
```

然后在 Service 中引入 Repository：

```ts
@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>
  ) {}

  findAll(): Promise<Photo[]> {
    return this.photoRepository.find();
  }
}
```

如果要在导入 TypeOrmModule.forFeature 的模块之外使用存储库，则需要重新导出由其生成的提供程序。您可以通过导出整个模块来做到这一点，如下所示：

```ts
@Module({
  imports: [TypeOrmModule.forFeature([Photo])],
  exports: [TypeOrmModule]
})
export class PhotoModule {}
```

# 多数据库

一些项目需要多个数据库连接。这也可以通过该模块来实现。要使用多个连接，请首先创建连接。在这种情况下，连接命名成为强制性的。假设您有一个 Person 实体和一个 Album 实体，它们分别存储在各自的数据库中。

```ts
const defaultOptions = {
  type: "postgres",
  port: 5432,
  username: "user",
  password: "password",
  database: "db",
  synchronize: true
};

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...defaultOptions,
      host: "photo_db_host",
      entities: [Photo]
    }),
    TypeOrmModule.forRoot({
      ...defaultOptions,
      name: "personsConnection",
      host: "person_db_host",
      entities: [Person]
    }),
    TypeOrmModule.forRoot({
      ...defaultOptions,
      name: "albumsConnection",
      host: "album_db_host",
      entities: [Album]
    })
  ]
})
export class AppModule {}
```

此时，您已将每个 Photo，Person 和 Album 实体注册为各自的连接。使用此设置，您必须告诉 TypeOrmModule.forFeature()函数和@InjectRepository()装饰器应使用哪个连接。如果未传递任何连接名称，则使用默认连接。

```ts
@Module({
  imports: [
    TypeOrmModule.forFeature([Photo]),
    TypeOrmModule.forFeature([Person], "personsConnection"),
    TypeOrmModule.forFeature([Album], "albumsConnection")
  ]
})
export class AppModule {}
```

然后可以注入 Connection 或 EntityManager：

```ts
@Injectable()
export class PersonService {
  constructor(
    @InjectConnection("personsConnection")
    private readonly connection: Connection,
    @InjectEntityManager("personsConnection")
    private readonly entityManager: EntityManager
  ) {}
}
```

# Testing

在对应用程序进行单元测试时，我们通常希望避免建立数据库连接，使我们的测试套件保持独立，并尽可能快地执行它们。但是我们的类可能取决于从连接实例中拉出的存储库。我们该如何处理？ 解决方案是创建模拟存储库。为此，我们设置了自定义提供程序。每个注册的存储库都由 `<EntityName>Repository` 标记自动表示，其中 EntityName 是您的实体类的名称。

```ts
@Module({
  providers: [
    PhotoService,
    {
      provide: getRepositoryToken(Photo),
      useValue: mockRepository
    }
  ]
})
export class PhotoModule {}
```

现在，替代的嘲讽存储库将用作 PhotoRepository。每当任何类使用@InjectRepository() 装饰器要求提供 PhotoRepository 时，Nest 都会使用已注册的 mockRepository 对象。

# 自定义 Repository

TypeORM 提供了一种称为自定义存储库的功能。自定义存储库允许您扩展基本存储库类，并使用几种特殊方法来丰富它。

```ts
@EntityRepository(Author)
export class AuthorRepository extends Repository<Author> {}
```

创建类后，下一步就是将实例化责任委托给 Nest。为此，我们必须将 AuthororRepository 类传递给 TypeOrm.forFeature()方法。

```ts
@Module({
  imports: [TypeOrmModule.forFeature([AuthorRepository])],
  controller: [AuthorController],
  providers: [AuthorService]
})
export class AuthorModule {}
```

然后用如下方式注入：

```ts
@Injectable()
export class AuthorService {
  constructor(private readonly authorRepository: AuthorRepository) {}
}
```
