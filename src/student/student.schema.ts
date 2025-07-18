
import { Schema } from 'mongoose';

export const StudentSchema = new Schema({
  name: { type: String, required: true, trim: true },
  deptNo: { type: String, required: true, unique: true }, // instead of rollNumber
  uid: { type: String, required: true, unique: true }, // RFID tag UID
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true, match: /^[6-9]\d{9}$/ },
  isBlocked: { type: Boolean, default: false },
}, {
  timestamps: true
});
