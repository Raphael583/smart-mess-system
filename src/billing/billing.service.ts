import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Billing } from './interfaces/billing.interface';
import { MealLog } from '../meal-log/interfaces/meal-log.interface';
import { WeeklyMenu } from '../weekly-menu/interfaces/weekly-menu.interface';
import { Student } from '../student/student.interface';

@Injectable()
export class BillingService {
  constructor(
    @InjectModel('Billing') private billingModel: Model<Billing>,
    @InjectModel('MealLog') private mealLogModel: Model<MealLog>,
    @InjectModel('WeeklyMenu') private menuModel: Model<WeeklyMenu>,
    @InjectModel('Student') private studentModel: Model<Student>,
  ) {}

  async generateBillsForMonth(month: string): Promise<any[]> {
    const start = new Date(`${month} 1`);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);

    const students = await this.studentModel.find();
    const bills: any[] = [];

    for (const student of students) {
      const logs = await this.mealLogModel
        .find({
          studentId: student._id,
          date: { $gte: start, $lte: end },
        })
        .populate('dishId')
        .exec();

      if (!logs.length) continue;

      const totalMeals = logs.length;
      const totalAmount = logs.reduce(
        (sum, log: any) => sum + (log.dishId?.price || 0),
        0
      );

      // Skip duplicates
      const existingBill = await this.billingModel.findOne({
        studentId: student._id,
        month,
      });
      if (existingBill) continue;

      const bill = new this.billingModel({
        studentId: student._id,
        month,
        totalMeals,
        totalAmount,
      });

      await bill.save();
      bills.push(bill);
    }

    // 👉 Ensure we populate before returning
    const populatedBills = await this.billingModel
      .find({ month })
      .populate('studentId', 'name deptNo') // ✅ only get name & deptNo
      .exec();

    return populatedBills.map(bill => {
      const student: any = bill.studentId;
      return {
        id: bill._id,
        studentName: student?.name || 'Unknown',
        deptNo: student?.deptNo || 'N/A',
        month: bill.month,
        totalMeals: bill.totalMeals,
        totalAmount: bill.totalAmount,
        isPaid: bill.isPaid,
        generatedAt: bill.generatedAt,
      };
    });
  }

  async getBills(): Promise<any[]> {
    const bills = await this.billingModel
      .find()
      .populate('studentId', 'name deptNo')
      .exec();

    return bills.map(bill => {
      const student: any = bill.studentId;
      return {
        id: bill._id,
        studentName: student?.name || 'Unknown',
        deptNo: student?.deptNo || 'N/A',
        month: bill.month,
        totalMeals: bill.totalMeals,
        totalAmount: bill.totalAmount,
        isPaid: bill.isPaid,
        generatedAt: bill.generatedAt,
      };
    });
  }

  async getBillByStudent(studentId: string): Promise<Billing[]> {
    return this.billingModel.find({ studentId }).exec();
  }

  async markAsPaid(id: string): Promise<{ message: string }> {
    const bill = await this.billingModel.findByIdAndUpdate(
      id,
      { isPaid: true },
      { new: true },
    );
    if (!bill) throw new NotFoundException('Bill not found');
    return { message: 'Marked as paid' };
  }
}
