import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthMiddleware } from '../../shared/middlewares/auth.middleware';
import { UserEntity } from '../user/entity/user.entity';
import { UserModule } from '../user/user.module';

import { ProfileController } from './controller/profile.controller';
import { FollowsEntity } from './entity/follows.entity';
import { ProfileService } from './service/profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FollowsEntity]), UserModule],
  providers: [ProfileService],
  controllers: [ProfileController],
  exports: [],
})
export class ProfileModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {}
}
