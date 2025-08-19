import { Controller, Post, Body, Get } from '@nestjs/common';
import { MealLogService } from './meal-log.service';
import { CreateMealLogDto } from './dto/create-meal-log.dto';

@Controller('meallog')
export class MealLogController {
  constructor(private readonly mealLogService: MealLogService) {}

  // ✅ for frontend to create entry
  @Post()
  create(@Body() dto: CreateMealLogDto) {
    return this.mealLogService.create(dto);
  }

  // ✅ to view all entries
  @Get()
  findAll() {
    return this.mealLogService.findAll();
  }

  // ✅ RFID preview
  @Post('preview')
  preview(@Body('rfidUID') rfidUID: string) {
    return this.mealLogService.getPreviewByRFID(rfidUID);
  }
}
