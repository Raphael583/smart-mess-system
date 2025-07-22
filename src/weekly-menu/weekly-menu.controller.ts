import { Controller, Post, Get, Body, Param, Put, Delete } from '@nestjs/common';
import { WeeklyMenuService } from './weekly-menu.service';
import { CreateWeeklyMenuDto } from './dto/create-weekly-menu.dto';
import { UpdateWeeklyMenuDto } from './dto/update-weekly-menu.dto';

@Controller('weeklymenu')
export class WeeklyMenuController {
  constructor(private readonly weeklyMenuService: WeeklyMenuService) {}

  @Post()
  async create(@Body() dto: CreateWeeklyMenuDto) {
    return this.weeklyMenuService.create(dto);
  }

  @Post('bulk')
  async createMany(@Body() dtos: CreateWeeklyMenuDto[]) {
    return this.weeklyMenuService.createMany(dtos);
  }

  @Get()
  async findAll() {
    return this.weeklyMenuService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateWeeklyMenuDto) {
    return this.weeklyMenuService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.weeklyMenuService.remove(id);
  }
}
