import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MealLog } from './interfaces/meal-log.interface';
import { CreateMealLogDto } from './dto/create-meal-log.dto';
import { Student } from '../student/student.interface';
import { WeeklyMenu } from '../weekly-menu/interfaces/weekly-menu.interface';
import { getCurrentMealType } from '../meal-log/utils/time.utils';

@Injectable()
export class MealLogService {
  constructor(
    @InjectModel('MealLog') private mealLogModel: Model<MealLog>,
    @InjectModel('Student') private studentModel: Model<Student>,
    @InjectModel('WeeklyMenu') private menuModel: Model<WeeklyMenu>,
  ) {}

  async create(dto: CreateMealLogDto): Promise<MealLog> {
    const log = new this.mealLogModel(dto);
    return log.save();
  }

  async findAll(): Promise<MealLog[]> {
    return this.mealLogModel.find().populate('studentId').populate('dishId').exec();
  }

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
      studentName: student.name,
      deptNo: student.deptNo,
      messType: student.messType,
      mealType,
      day: today,
      dishName: menu.dishName,
      price: menu.price,
    };
  }
}
