import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthMiddleware } from '../../shared/middlewares/auth.middleware';
import { FollowsEntity } from '../profile/entity/follows.entity';
import { UserEntity } from '../user/entity/user.entity';
import { UserModule } from '../user/user.module';

import { ArticleController } from './controller/article.controller';
import { ArticleEntity } from './entity/article.entity';
import { Comment } from './entity/comment.entity';
import { ArticleService } from './service/article.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ArticleEntity,
      Comment,
      UserEntity,
      FollowsEntity,
    ]),
    UserModule,
  ],
  providers: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {}
}
