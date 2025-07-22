import { Document } from 'mongoose';

export interface WeeklyMenu extends Document {
  day: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner';
  dishName: string;
  messType: 'Veg' | 'Non-Veg';
  price: number;
  createdAt: Date;
  updatedAt: Date;
}
