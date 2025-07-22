import { IsString, IsDateString, IsEnum, IsMongoId, IsBoolean } from 'class-validator';

export class CreateMealLogDto {
  @IsMongoId()
  studentId: string;

  @IsDateString()
  date: string;

  @IsEnum(['Breakfast', 'Lunch', 'Dinner'])
  mealType: 'Breakfast' | 'Lunch' | 'Dinner';

  @IsMongoId()
  dishId: string;

  @IsEnum(['Veg', 'Non-Veg'])
  messType: 'Veg' | 'Non-Veg';

  @IsBoolean()
  scannedViaRFID: boolean;
}
