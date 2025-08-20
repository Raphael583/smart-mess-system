import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MealLog } from './interfaces/meal-log.interface';
import { Student } from '../student/student.interface';
import { WeeklyMenu } from '../weekly-menu/interfaces/weekly-menu.interface';
import { RfidService } from '../rfid/rfid.service';

@Injectable()
export class MealLogService {
  constructor(
    @InjectModel('MealLog') private mealLogModel: Model<MealLog>,
    @InjectModel('Student') private studentModel: Model<Student>,
    @InjectModel('WeeklyMenu') private menuModel: Model<WeeklyMenu>,
    private readonly rfidService: RfidService,
  ) {}

  // ✅ Create meal log using only RFID + mealType
  async create(mealType: 'Breakfast' | 'Lunch' | 'Dinner'): Promise<any> {
    const rfidUID = this.rfidService.getUID();
    if (!rfidUID) {
      throw new BadRequestException('No RFID UID detected. Please tap card.');
    }

    const student = await this.studentModel.findOne({ rfidUID });
    if (!student) throw new NotFoundException('Student not found for this RFID');

    const today = new Date();
    const day = today.toLocaleDateString('en-US', { weekday: 'long' });

    const menu = await this.menuModel.findOne({
      day,
      mealType,
      messType: student.messType,
    });
    if (!menu) throw new NotFoundException(`No menu found for ${day} ${mealType} (${student.messType})`);

    const log = new this.mealLogModel({
      studentId: student._id,
      rfidUID,
      date: today,
      mealType,
      dishId: menu._id,
      messType: student.messType,
      scannedViaRFID: true,
    });

    const savedLog = await log.save();

    return {
      studentName: student.name,
      deptNo: student.deptNo,
      messType: student.messType,
      mealType,
      day,
      dishName: menu.dishName,
      price: menu.price,
      createdAt: savedLog.createdAt,
    };
  }

  // ✅ Fetch all logs with populated student + menu
  async findAll(): Promise<any[]> {
    const logs = await this.mealLogModel
      .find()
      .populate('studentId')
      .populate('dishId')
      .exec();

    return logs.map((log: any) => ({
      studentName: (log.studentId as any)?.name,
      deptNo: (log.studentId as any)?.deptNo,
      messType: log.messType,
      mealType: log.mealType,
      date: log.date,
      dishName: (log.dishId as any)?.dishName,
      price: (log.dishId as any)?.price,
      createdAt: log.createdAt,
    }));
  }

  // ✅ Preview before logging
  async getPreviewByRFID(mealType: 'Breakfast' | 'Lunch' | 'Dinner') {
    const rfidUID = this.rfidService.getUID();
    if (!rfidUID) {
      throw new BadRequestException('No RFID UID detected. Please tap card.');
    }

    const student = await this.studentModel.findOne({ rfidUID });
    if (!student) throw new NotFoundException('Student not found for this RFID');

    const today = new Date();
    const day = today.toLocaleDateString('en-US', { weekday: 'long' });

    const menu = await this.menuModel.findOne({
      day,
      mealType,
      messType: student.messType,
    });

    if (!menu) throw new NotFoundException(`No menu found for ${day} ${mealType} (${student.messType})`);

    return {
      studentName: student.name,
      deptNo: student.deptNo,
      messType: student.messType,
      mealType,
      day,
      dishName: menu.dishName,
      price: menu.price,
    };
  }
}
