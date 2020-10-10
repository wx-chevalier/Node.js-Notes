import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { ApiTags } from '@nestjs/swagger';

import { BaseController } from '../../../shared/base.controller';
import { ValidationPipe } from '../../../shared/pipes/validation.pipe';
import { LoginUserDto } from '../../user/dto';
import { UserService } from '../../user/service/user.service';
import { UserRespDto } from '../dto/user-resp.dto';

@ApiTags('noauth')
@Controller('noauth')
export class LoginController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @UsePipes(new ValidationPipe())
  @Post('login')
  async loginByEmail(@Body() loginUserDto: LoginUserDto): Promise<UserRespDto> {
    const _user = await this.userService.findOne(loginUserDto);

    const errors = 'User not found';

    if (!_user) throw new HttpException({ errors }, 401);

    const token = await this.userService.generateJWT(_user);

    const { email, username, bio, image } = _user;
    const user = { email, username, bio, image };

    return new UserRespDto({ user, token });
  }
}
