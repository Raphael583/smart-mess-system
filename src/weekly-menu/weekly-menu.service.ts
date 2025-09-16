// weekly-menu.service.ts (only show updated findAll)
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WeeklyMenu } from './interfaces/weekly-menu.interface';
import { CreateWeeklyMenuDto } from './dto/create-weekly-menu.dto';
import { UpdateWeeklyMenuDto } from './dto/update-weekly-menu.dto';

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

  // <-- NEW improved grouping: keeps both Veg & Non-Veg per meal
  async findAll() {
    const menus = await this.menuModel.find().exec();

    const grouped: Record<string, any> = {};

    menus.forEach((menu) => {
      const day = menu.day;
      if (!grouped[day]) {
        grouped[day] = {
          day,
          breakfastVeg: null,
          breakfastNonVeg: null,
          lunchVeg: null,
          lunchNonVeg: null,
          dinnerVeg: null,
          dinnerNonVeg: null,
        };
      }

      // normalize keys: Breakfast/Lunch/Dinner and Veg / Non-Veg
      const mealLower = (menu.mealType || '').toLowerCase(); // breakfast/lunch/dinner
      const isVeg = (menu.messType || '').toLowerCase().startsWith('veg'); // Veg vs Non-Veg
      const key = `${mealLower}${isVeg ? 'Veg' : 'NonVeg'}`; // e.g. breakfastVeg or breakfastNonVeg

      grouped[day][key] = {
        id: menu._id,
        dishName: menu.dishName,
        price: menu.price,
        messType: menu.messType,
      };
    });

    // return array of days
    return Object.values(grouped);
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
