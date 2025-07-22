import { Document } from 'mongoose';

export interface Billing extends Document {
  studentId: string;
  month: string; // 'July 2025'
  totalMeals: number;
  totalAmount: number;
  isPaid: boolean;
  generatedAt: Date;
}
