import { Document } from 'mongoose';

export interface Student extends Document {
  name: string;
  deptNo: string;
  rfidUID: string;
  year: number;
  phoneNumber: string;
  email?: string;
  messType: 'Veg' | 'Non-Veg';
  roomNumber: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
