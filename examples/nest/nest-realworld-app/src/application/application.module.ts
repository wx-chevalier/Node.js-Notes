import { MiddlewareConsumer, Module, Req, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { ArticleModule } from '../modules/article/article.module';
import { CatsModule } from '../modules/cat/cats.module';
import { NoAuthModule } from '../modules/noauth/noauth.module';
import { ProfileModule } from '../modules/profile/profile.module';
import { TagModule } from '../modules/tag/tag.module';
import { UserModule } from '../modules/user/user.module';
import { AuthMiddleware } from '../shared/middlewares/auth.middleware';

import { AppController } from './application.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    NoAuthModule,
    ArticleModule,
    CatsModule,
    UserModule,
    ProfileModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class ApplicationModule {
  // eslint-disable-next-line @typescript-eslint/member-naming
  constructor(private readonly connection: Connection) {}

  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/users/*', method: RequestMethod.ALL });
  }
}
