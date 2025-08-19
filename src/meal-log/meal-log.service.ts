import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MealLog } from './interfaces/meal-log.interface';
import { CreateMealLogDto } from './dto/create-meal-log.dto';
import { Student } from '../student/student.interface';
import { WeeklyMenu } from '../weekly-menu/interfaces/weekly-menu.interface';
import { getCurrentMealType } from './utils/time.utils';

@Injectable()
export class MealLogService {
  constructor(
    @InjectModel('MealLog') private mealLogModel: Model<MealLog>,
    @InjectModel('Student') private studentModel: Model<Student>,
    @InjectModel('WeeklyMenu') private menuModel: Model<WeeklyMenu>,
  ) {}

  // ✅ create entry (from frontend or backend RFID flow)
  async create(dto: CreateMealLogDto): Promise<MealLog> {
    const student = await this.studentModel.findById(dto.studentId);
    if (!student) throw new NotFoundException('Student not found');

    const log = new this.mealLogModel({
      ...dto,
      rfidUID: dto.rfidUID,  // ✅ now must be explicitly set
      messType: student.messType, // ensure consistency with student’s messType
    });

    return log.save();
  }

  async findAll(): Promise<MealLog[]> {
    return this.mealLogModel.find()
      .populate('studentId')
      .populate('dishId')
      .exec();
  }

  // ✅ preview meal before logging
  async getPreviewByRFID(rfidUID: string) {
    const student = await this.studentModel.findOne({ rfidUID });
    if (!student) throw new NotFoundException('Student not found');

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const mealType = getCurrentMealType();

    const menu = await this.menuModel.findOne({
      day: today,
      mealType,
      messType: student.messType,
    });

    if (!menu) throw new NotFoundException('No menu available');

    return {
      studentId: student._id,
      studentName: student.name,
      deptNo: student.deptNo,
      messType: student.messType,
      rfidUID,
      mealType,
      day: today,
      dishId: menu._id,
      dishName: menu.dishName,
      price: menu.price,
    };
  }
}
