import { Schema } from 'mongoose';

export const WeeklyMenuSchema = new Schema(
  {
    day: { type: String, required: true },
    mealType: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner'], required: true },
    dishName: { type: String, required: true },
    messType: { type: String, enum: ['Veg', 'Non-Veg'], required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);
