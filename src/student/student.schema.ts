import { Schema } from 'mongoose';

export const StudentSchema = new Schema(
  {
    name: { type: String, required: true },
    deptNo: { type: String, required: true, unique: true },
    rfidUID: { type: String, required: true, unique: true },
    
    phoneNumber: { type: String, required: true },
    email: { type: String },
    messType: { type: String, enum: ['Veg', 'Non-Veg'], required: true },
    roomNumber: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
