import { Schema } from 'mongoose';

export const MealLogSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    date: { type: Date, required: true },
    mealType: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner'], required: true },
    dishId: { type: Schema.Types.ObjectId, ref: 'WeeklyMenu', required: true },
    messType: { type: String, enum: ['Veg', 'Non-Veg'], required: true },
    scannedViaRFID: { type: Boolean, default: true },
  },
  { timestamps: true },
);
