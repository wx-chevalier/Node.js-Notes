import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { ApiTags } from '@nestjs/swagger';

import { BaseController } from '../../../shared/base.controller';
import { ValidationPipe } from '../../../shared/pipes/validation.pipe';
import { CreateUserDto } from '../../user/dto';
import { UserService } from '../../user/service/user.service';

@ApiTags('noauth')
@Controller('noauth')
export class RegisterController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @UsePipes(new ValidationPipe())
  @Post('register')
  async create(@Body() userData: CreateUserDto) {
    return this.userService.create(userData);
  }
}
