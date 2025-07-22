// src/admin/schemas/admin.schema.ts
import { Schema } from 'mongoose';

export const AdminSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);
