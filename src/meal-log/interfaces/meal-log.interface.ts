import { Document } from 'mongoose';

export interface MealLog extends Document {
  studentId: string;
  rfidUID: string;
  date: Date;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner';
  dishId: string;
  messType: 'Veg' | 'Non-Veg';
  scannedViaRFID: boolean;
  createdAt: Date;
}
