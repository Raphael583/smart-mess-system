import { IsEnum, IsOptional } from 'class-validator';

export class CreateMealLogDto {
  @IsOptional()
  @IsEnum(['Breakfast', 'Lunch', 'Dinner'])
  mealType?: 'Breakfast' | 'Lunch' | 'Dinner';  // Optional now
}
