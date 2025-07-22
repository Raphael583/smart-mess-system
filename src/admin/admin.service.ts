// src/admin/admin.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Admin } from './interfaces/admin.interface';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

import { MealLog } from 'src/meal-log/interfaces/meal-log.interface';
import { Billing } from 'src/billing/interfaces/billing.interface';
import { Student } from 'src/student/student.interface';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('Admin') private adminModel: Model<Admin>,
    @InjectModel('MealLog') private mealLogModel: Model<MealLog>,
    @InjectModel('Billing') private billingModel: Model<Billing>,
    @InjectModel('Student') private studentModel: Model<Student>,
  ) {}

  // ✅ Create Admin
  async create(dto: CreateAdminDto): Promise<Admin> {
    const admin = new this.adminModel(dto);
    return admin.save();
  }

  // ✅ Get All Admins
  async findAll(): Promise<Admin[]> {
    return this.adminModel.find().exec();
  }

  // ✅ Get One Admin
  async findOne(id: string): Promise<Admin> {
    const admin = await this.adminModel.findById(id).exec();
    if (!admin) throw new NotFoundException(`Admin with ID ${id} not found`);
    return admin;
  }

  // ✅ Update Admin
  async update(id: string, dto: UpdateAdminDto): Promise<Admin> {
    const updated = await this.adminModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`Admin with ID ${id} not found`);
    return updated;
  }

  // ✅ Delete Admin
  async delete(id: string): Promise<any> {
    return this.adminModel.findByIdAndDelete(id).exec();
  }

  // ✅ Generate Monthly Bills
async generateMonthlyBills(month: string): Promise<any> {
  const start = new Date(`${month}-01`);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);

  const logs = await this.mealLogModel
    .find({ date: { $gte: start, $lt: end } })
    .populate('dishId')
    .exec();

  const billsMap = new Map();

  for (const log of logs) {
    const sid = log.studentId.toString();
    const dish: any = log.dishId;  // 👈 cast to any
    const price = dish?.price || 0;

    if (!billsMap.has(sid)) {
      billsMap.set(sid, { totalMeals: 0, totalAmount: 0 });
    }

    const bill = billsMap.get(sid);
    bill.totalMeals += 1;
    bill.totalAmount += price;
  }

  const results: Billing[] = [];  // 👈 specify type

  for (const [studentId, data] of billsMap.entries()) {
    const newBill = new this.billingModel({
      studentId,
      month,
      totalMeals: data.totalMeals,
      totalAmount: data.totalAmount,
      generatedAt: new Date(),
      isPaid: false,
    });
    results.push(await newBill.save());
  }

  return { message: 'Bills generated successfully', count: results.length };
}
}
