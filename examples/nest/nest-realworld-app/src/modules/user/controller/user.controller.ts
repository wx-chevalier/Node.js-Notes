import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { BaseController } from '../../../shared/base.controller';
import { ValidationPipe } from '../../../shared/pipes/validation.pipe';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from '../dto';
import { User } from '../service/user.decorator';
import { UserRO } from '../service/user.interface';
import { UserService } from '../service/user.service';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @Get('user')
  async findMe(@User('email') email: string): Promise<UserRO> {
    return await this.userService.findByEmail(email);
  }

  @Put('user')
  async update(
    @User('id') userId: number,
    @Body('user') userData: UpdateUserDto,
  ) {
    return await this.userService.update(userId, userData);
  }

  @UsePipes(new ValidationPipe())
  @Post('users')
  async create(@Body('user') userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @Delete('users/:slug')
  async delete(@Param() params) {
    return await this.userService.delete(params.slug);
  }
}
