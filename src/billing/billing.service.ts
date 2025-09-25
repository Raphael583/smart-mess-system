import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Billing } from './interfaces/billing.interface';
import { MealLog } from '../meal-log/interfaces/meal-log.interface';
import { WeeklyMenu } from '../weekly-menu/interfaces/weekly-menu.interface';
import { Student } from '../student/student.interface';
import * as nodemailer from 'nodemailer';

@Injectable()
export class BillingService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER, // gmail ID
      pass: process.env.GMAIL_PASS, // app password
    },
  });

  constructor(
    @InjectModel('Billing') private readonly billingModel: Model<Billing>,
    @InjectModel('MealLog') private readonly mealLogModel: Model<MealLog>,
    @InjectModel('WeeklyMenu') private readonly menuModel: Model<WeeklyMenu>,
    @InjectModel('Student') private readonly studentModel: Model<Student>,
  ) {}

  async generateBillsForMonth(month: string): Promise<any[]> {
    const start = new Date(`${month} 1`);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);

    const students = await this.studentModel.find().exec();
    const createdBills: any[] = [];

    console.log(`📌 Starting bill generation for ${month}...`);

    for (const student of students) {
      console.log(`\n Processing student: ${student.name} (${student.email})`);

      const logs = await this.mealLogModel.find({
        studentId: student._id,
        date: { $gte: start, $lte: end },
      });

      if (!logs || logs.length === 0) {
        console.log(`    No meal logs found for ${student.name}`);
        continue;
      }

      const dishIds = logs.map(l => String(l.dishId)).filter(Boolean);
      if (dishIds.length === 0) {
        console.log(`    No valid dish IDs for ${student.name}`);
        continue;
      }

      const menus = await this.menuModel
        .find({ _id: { $in: dishIds } })
        .select('_id price messType')
        .lean();

      const menuMap = new Map<string, any>();
      for (const m of menus) menuMap.set(String(m._id), m);

      let validMeals = 0;
      let totalAmount = 0;

      for (const log of logs) {
        const menu = menuMap.get(String(log.dishId));
        if (!menu) continue;

        if (menu.messType && student.messType && menu.messType !== student.messType) continue;

        validMeals++;
        totalAmount += Number(menu.price || 0);
      }

      if (validMeals === 0) {
        console.log(`   No valid meals for ${student.name}`);
        continue;
      }

      const existingBill = await this.billingModel.findOne({ studentId: student._id, month });
      if (existingBill) {
        console.log(`    Bill already exists for ${student.name}`);
        continue;
      }

      const bill = new this.billingModel({
        studentId: student._id,
        month,
        totalMeals: validMeals,
        totalAmount,
      });

      await bill.save();
      console.log(`   Bill generated: ${validMeals} meals | ₹${totalAmount}`);

      // ✅ Send email only to this student
      if (student.email) {
        const mailOptions = {
          from: `"Mess Billing" <${process.env.GMAIL_USER}>`,
          to: student.email,
          subject: `Your ${month} Mess Bill`,
          text: `Hello ${student.name},\n\n` +
                `Your mess bill for ${month} is ready.\n\n` +
                `Total Meals: ${validMeals}\n` +
                `Total Amount: ₹${totalAmount}\n\n` +
                `Please pay at the hostel office.\n\nThank you.`,
        };

        try {
          const info = await this.transporter.sendMail(mailOptions);
          console.log(`    Mail sent to ${student.email} | MessageId: ${info.messageId}`);
        } catch (error) {
          console.error(`   Failed to send mail to ${student.email}:`, error.message);
        }
      } else {
        console.log(`   No email address for ${student.name}`);
      }

      createdBills.push(bill);
    }

    console.log(`\n Finished bill generation for ${month}.`);

    const populatedBills = await this.billingModel
      .find({ month })
      .populate('studentId', 'name deptNo messType');

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
