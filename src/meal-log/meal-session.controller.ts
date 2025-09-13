import { Controller, Post, Body } from '@nestjs/common';
import { MealSessionService } from './meal-session.service';

@Controller('meal-session')
export class MealSessionController {
  constructor(private readonly mealSessionService: MealSessionService) {}

  @Post('start')
  startMeal(@Body('mealType') mealType: 'Breakfast' | 'Lunch' | 'Dinner') {
    return this.mealSessionService.startMeal(mealType);
  }

  @Post('stop')
  stopMeal() {
    return this.mealSessionService.stopMeal();
  }
}
