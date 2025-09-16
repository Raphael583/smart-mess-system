import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MealLog } from './interfaces/meal-log.interface';
import { Student } from 'src/student/student.interface';
import { WeeklyMenu } from '../weekly-menu/interfaces/weekly-menu.interface';
import { RfidService } from '../rfid/rfid.service';

@Injectable()
export class MealLogService {
  constructor(
    @InjectModel('MealLog') private readonly mealLogModel: Model<MealLog>,
    @InjectModel('Student') private readonly studentModel: Model<Student>,
    @InjectModel('WeeklyMenu') private readonly weeklyMenuModel: Model<WeeklyMenu>,
    private readonly rfidService: RfidService,
  ) {}

  // 🔹 New session state
  private activeMeal: 'Breakfast' | 'Lunch' | 'Dinner' | null = null;

  // ✅ Start meal logging session
  /*startMeal(mealType: 'Breakfast' | 'Lunch' | 'Dinner') {
    if (this.activeMeal) {
      throw new BadRequestException(
        `Meal logging already active for ${this.activeMeal}`,
      );
    }
    this.activeMeal = mealType;
    return { message: `${mealType} logging started` };
  }

  // ✅ Stop meal logging session
  stopMeal() {
    if (!this.activeMeal) {
      throw new BadRequestException(`No active meal logging to stop`);
    }
    const stopped = this.activeMeal;
    this.activeMeal = null;
    return { message: `${stopped} logging stopped` };
  }*/

  // ✅ Check active meal
  getActiveMeal() {
    return this.activeMeal;
  }

  // ✅ Log a meal for a student using RFID
async logMeal(mealType: 'Breakfast' | 'Lunch' | 'Dinner') {
  const rfidUID = this.rfidService.getUID();
  if (!rfidUID) {
    throw new BadRequestException('No RFID UID found. Please scan the card.');
  }

  // 1. Find student by RFID
  const student = await this.studentModel.findOne({ rfidUID }).exec();
  if (!student) {
    throw new BadRequestException('Student not found for this RFID UID.');
  }

  // 2. Find today's menu (by weekday + student’s messType)
  const today = new Date().toLocaleString('en-US', { weekday: 'long' });

  const menu = await this.weeklyMenuModel
    .findOne({
      mealType,
      messType: student.messType,
      day: today,
    })
    .exec();

  if (!menu) {
    throw new BadRequestException(
      `No ${student.messType} menu found for ${mealType} today.`,
    );
  }

  // 3. Prevent duplicate log (same student + mealType + same day)
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const existingLog = await this.mealLogModel
    .findOne({
      studentId: student._id,
      mealType,
      date: { $gte: startOfDay, $lte: endOfDay },
    })
    .exec();

  if (existingLog) {
    throw new BadRequestException(`Meal already logged for ${mealType} today.`);
  }

  // 4. Save meal log
  const newLog = new this.mealLogModel({
    studentId: student._id,
    rfidUID,
    date: new Date(),
    mealType,
    dishId: menu._id,
    messType: student.messType,
    scannedViaRFID: true,
  });

  await newLog.save();

  return {
    message: `${mealType} logged successfully`,
    studentName: student.name,
    messType: student.messType,
    dishName: menu.dishName,
    price: menu.price,
  };
}

  // ✅ Get all meal logs
  async findAll() {
    return this.mealLogModel
      .find()
      .populate('studentId')
      .populate('dishId')
      .exec();
  }

  // ✅ Preview meal before logging
  async getPreviewByRFID(mealType: 'Breakfast' | 'Lunch' | 'Dinner') {
    const rfidUID = this.rfidService.getUID();
    if (!rfidUID) {
      throw new BadRequestException('No RFID UID found. Please scan the card.');
    }

    const student = await this.studentModel.findOne({ rfidUID }).exec();
    if (!student) {
      throw new BadRequestException('Student not found for this RFID UID.');
    }

    // Match by weekday
    const today = new Date().toLocaleString('en-US', { weekday: 'long' });

    const menu = await this.weeklyMenuModel
      .findOne({
        mealType,
        messType: student.messType,
        day: today,
      })
      .exec();

    if (!menu) {
      throw new BadRequestException(
        `No ${student.messType} menu found for ${mealType} today.`,
      );
    }

    // ✅ Return simplified preview response
    return {
      message: `Preview for ${mealType}`,
      studentName: student.name,
      messType: student.messType,
      dishName: menu.dishName,
      price: menu.price,
    };
  }

  async getTotalMeals(): Promise<number> {
    return this.mealLogModel.countDocuments().exec();
  }

  async getMealLogCount(): Promise<number> {
    return this.mealLogModel.countDocuments().exec();
  }
}
