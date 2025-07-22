import { Schema } from 'mongoose';

export const BillingSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    month: { type: String, required: true },
    totalMeals: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
