import { Controller, Post, Body, Get } from '@nestjs/common';
import { MealLogService } from './meal-log.service';

@Controller('meallog')
export class MealLogController {
  constructor(private readonly mealLogService: MealLogService) {}

  // ✅ Log a meal (only mealType is required)
  @Post()
  async logMeal(@Body('mealType') mealType: 'Breakfast' | 'Lunch' | 'Dinner') {
    return this.mealLogService.logMeal(mealType);
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
