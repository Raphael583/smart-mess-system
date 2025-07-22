import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WeeklyMenu } from './interfaces/weekly-menu.interface';
import { CreateWeeklyMenuDto } from './dto/create-weekly-menu.dto';
import { UpdateWeeklyMenuDto } from './dto/update-weekly-menu.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class WeeklyMenuService {
  constructor(
    @InjectModel('WeeklyMenu') private readonly menuModel: Model<WeeklyMenu>,
  ) {}

  async create(dto: CreateWeeklyMenuDto): Promise<WeeklyMenu> {
    return new this.menuModel(dto).save();
  }

  async createMany(dtos: CreateWeeklyMenuDto[]): Promise<WeeklyMenu[]> {
    return this.menuModel.insertMany(dtos);
  }

  async findAll(): Promise<WeeklyMenu[]> {
    return this.menuModel.find().exec();
  }

 async update(id: string, dto: UpdateWeeklyMenuDto): Promise<WeeklyMenu> {
  const updated = await this.menuModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  if (!updated) {
    throw new NotFoundException(`WeeklyMenu with ID ${id} not found`);
  }
  return updated;
}
  async remove(id: string): Promise<any> {
    return this.menuModel.findByIdAndDelete(id).exec();
  }
}
