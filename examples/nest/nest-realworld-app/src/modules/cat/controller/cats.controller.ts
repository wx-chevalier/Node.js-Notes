import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { BaseController } from '../../../shared/base.controller';
import { ParseIntPipe } from '../../../shared/pipes/parse-int.pipe';
import { CreateCatDto } from '../dto/create-cat.dto';
import { Cat } from '../service/cat.interface';
import { CatsService } from '../service/cats.service';

@Controller('cats')
export class CatsController extends BaseController {
  constructor(private readonly catsService: CatsService) {
    super();
  }

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', new ParseIntPipe())
    id,
  ) {
    // logic
  }
}
