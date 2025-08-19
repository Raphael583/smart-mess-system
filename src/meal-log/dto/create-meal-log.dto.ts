import { IsString, IsDateString, IsEnum, IsMongoId, IsBoolean } from 'class-validator';

export class CreateMealLogDto {
  @IsMongoId()
  studentId: string;

  @IsString()
  rfidUID: string;   // ✅ now also required from frontend/backend

  @IsDateString()
  date: string;      // ✅ frontend calendar

  @IsEnum(['Breakfast', 'Lunch', 'Dinner'])
  mealType: 'Breakfast' | 'Lunch' | 'Dinner';  // ✅ frontend dropdown

  @IsMongoId()
  dishId: string;

  @IsEnum(['Veg', 'Non-Veg'])
  messType: 'Veg' | 'Non-Veg';

  @IsBoolean()
  scannedViaRFID: boolean;
}
