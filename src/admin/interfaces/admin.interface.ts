import { Document } from 'mongoose';

export interface Admin extends Document {
  readonly _id: string;   // ✅ MongoDB ObjectId
  readonly username: string;
  readonly password: string;
  readonly email: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
