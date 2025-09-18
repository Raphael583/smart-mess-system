// billing.service.ts
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
    @InjectModel('Billing') private readonly billingModel: Model<Billing>,
    @InjectModel('MealLog') private readonly mealLogModel: Model<MealLog>,
    @InjectModel('WeeklyMenu') private readonly menuModel: Model<WeeklyMenu>,
    @InjectModel('Student') private readonly studentModel: Model<Student>,
  ) {}

  /**
   * Generate bills for a given month string (e.g. "September 2025")
   * Calculates totals strictly from WeeklyMenu.price referenced by each MealLog.
   */
  async generateBillsForMonth(month: string): Promise<any[]> {
    const start = new Date(`${month} 1`);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);

    const students = await this.studentModel.find().exec();
    const createdBills: any[] = [];

    for (const student of students) {
      // fetch meal logs for the student in the month
      const logs = await this.mealLogModel
        .find({
          studentId: student._id,
          date: { $gte: start, $lte: end },
        })
        .exec();

      if (!logs || logs.length === 0) {
        // nothing to bill for this student this month
        continue;
      }

      // collect all dishIds referenced by logs (can be ObjectId or string)
      const dishIds = logs
        .map(l => (l.dishId ? String(l.dishId) : null))
        .filter(Boolean);

      if (dishIds.length === 0) {
        // no referenced menus - skip
        continue;
      }

      // fetch all referenced menu documents in one query
      const menus = await this.menuModel
        .find({ _id: { $in: dishIds } })
        .select('_id price messType') // only need these fields
        .lean()
        .exec();

      const menuMap = new Map<string, any>();
      for (const m of menus) {
        menuMap.set(String(m._id), m);
      }

      // compute totals only using menus that match student's messType
      let validMeals = 0;
      let totalAmount = 0;

      for (const log of logs) {
        const menu = menuMap.get(String(log.dishId));
        if (!menu) {
          // The referenced menu was not found - skip and warn for audit
          console.warn(
            `BillingService: missing WeeklyMenu for log ${String(
              log._id,
            )} (dishId: ${String(log.dishId)}) - student ${String(
              student._id,
            )}, month ${month}`,
          );
          continue;
        }

        // ensure the menu's messType matches student's messType
        // if it doesn't match, it's probably a logging mismatch — skip it to avoid wrong billing
        if (menu.messType && student.messType && menu.messType !== student.messType) {
          console.warn(
            `BillingService: messType mismatch - skipping log ${String(
              log._id,
            )}. menu.messType=${menu.messType}, student.messType=${student.messType}, student=${String(
              student._id,
            )}, dishId=${String(menu._id)}`,
          );
          continue;
        }

        // count this meal and add the menu price (safe convert to number)
        const price = Number(menu.price || 0);
        validMeals++;
        totalAmount += price;
      }

      if (validMeals === 0) {
        // no valid meals to bill (possible if all logs had mismatched messType)
        continue;
      }

      // Skip duplicates (do not generate bill if one already exists for student+month)
      const existingBill = await this.billingModel
        .findOne({ studentId: student._id, month })
        .exec();
      if (existingBill) {
        console.info(
          `BillingService: bill already exists for student ${String(
            student._id,
          )} month ${month}, skipping`,
        );
        continue;
      }

      // create and save the bill
      const bill = new this.billingModel({
        studentId: student._id,
        month,
        totalMeals: validMeals,
        totalAmount,
      });

      await bill.save();
      createdBills.push(bill);
    }

    // populate and return bills for the month
    const populatedBills = await this.billingModel
      .find({ month })
      .populate('studentId', 'name deptNo messType')
      .exec();

    return populatedBills.map(bill => {
      const student: any = bill.studentId;
      return {
        id: bill._id,
        studentName: student?.name || 'Unknown',
        deptNo: student?.deptNo || 'N/A',
        messType: student?.messType || 'N/A',
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
      .populate('studentId', 'name deptNo messType')
      .exec();

    return bills.map(bill => {
      const student: any = bill.studentId;
      return {
        id: bill._id,
        studentName: student?.name || 'Unknown',
        deptNo: student?.deptNo || 'N/A',
        messType: student?.messType || 'N/A',
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
