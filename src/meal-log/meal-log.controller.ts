import { Controller, Post, Body, Get } from '@nestjs/common';
import { MealLogService } from './meal-log.service';

@Controller('meallog')
export class MealLogController {
  constructor(private readonly mealLogService: MealLogService) {}

  // ✅ Create meal log (only mealType is required)
  @Post()
  async create(@Body('mealType') mealType: 'Breakfast' | 'Lunch' | 'Dinner') {
    return this.mealLogService.create(mealType);
  }

  // ✅ Get all logs
  @Get()
  async findAll() {
    return this.mealLogService.findAll();
  }

  // ✅ Preview before saving
  @Post('preview')
  async preview(@Body('mealType') mealType: 'Breakfast' | 'Lunch' | 'Dinner') {
    return this.mealLogService.getPreviewByRFID(mealType);
  }
}
