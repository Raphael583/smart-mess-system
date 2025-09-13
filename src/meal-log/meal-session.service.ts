import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class MealSessionService {
  private activeMeal: 'Breakfast' | 'Lunch' | 'Dinner' | null = null;

  startMeal(mealType: 'Breakfast' | 'Lunch' | 'Dinner') {
    if (this.activeMeal) {
      throw new BadRequestException(`Meal logging already active for ${this.activeMeal}`);
    }
    this.activeMeal = mealType;
    return { message: `${mealType} logging started` };
  }

  stopMeal() {
    if (!this.activeMeal) {
      throw new BadRequestException(`No active meal logging to stop`);
    }
    const stopped = this.activeMeal;
    this.activeMeal = null;
    return { message: `${stopped} logging stopped` };
  }

  getActiveMeal() {
    return this.activeMeal;
  }

  isMealActive() {
    return this.activeMeal !== null;
  }
}
