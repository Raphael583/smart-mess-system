
import { Document } from 'mongoose';

export interface Student extends Document {
  name: string;
  deptNo: string;
  uid: string;
  email: string;
  phone: string;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
