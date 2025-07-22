import { IsString, IsEnum, IsNumber } from 'class-validator';

export class CreateWeeklyMenuDto {
  @IsString()
  day: string;

  @IsEnum(['Breakfast', 'Lunch', 'Dinner'])
  mealType: 'Breakfast' | 'Lunch' | 'Dinner';

  @IsString()
  dishName: string;

  @IsEnum(['Veg', 'Non-Veg'])
  messType: 'Veg' | 'Non-Veg';

  @IsNumber()
  price: number;
}
