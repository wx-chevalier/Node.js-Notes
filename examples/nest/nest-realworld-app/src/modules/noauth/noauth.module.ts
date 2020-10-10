import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { UserModule } from '../user/user.module';

import { LoginController } from './controller/login.controller';
import { RegisterController } from './controller/register.controller';

@Module({
  imports: [UserModule],
  controllers: [LoginController, RegisterController],
})
export class NoAuthModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {}
}
