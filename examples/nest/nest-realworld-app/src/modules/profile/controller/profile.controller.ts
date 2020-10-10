import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { User } from '../../user/service/user.decorator';
import { ProfileRO } from '../service/profile.interface';
import { ProfileService } from '../service/profile.service';

@ApiBearerAuth()
@ApiTags('profiles')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  async getProfile(
    @User('id') userId: number,
    @Param('username') username: string,
  ): Promise<ProfileRO> {
    return await this.profileService.findProfile(userId, username);
  }

  @Post(':username/follow')
  async follow(
    @User('email') email: string,
    @Param('username') username: string,
  ): Promise<ProfileRO> {
    return await this.profileService.follow(email, username);
  }

  @Delete(':username/follow')
  async unFollow(
    @User('id') userId: number,
    @Param('username') username: string,
  ): Promise<ProfileRO> {
    return await this.profileService.unFollow(userId, username);
  }
}
