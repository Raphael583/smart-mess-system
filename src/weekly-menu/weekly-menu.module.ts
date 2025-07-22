import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WeeklyMenuService } from './weekly-menu.service';
import { WeeklyMenuController } from './weekly-menu.controller';
import { WeeklyMenuSchema } from './schemas/weekly-menu.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'WeeklyMenu', schema: WeeklyMenuSchema }]),
  ],
  controllers: [WeeklyMenuController],
  providers: [WeeklyMenuService],
  exports: [WeeklyMenuService], // Optional if used in other modules
})
export class WeeklyMenuModule {}
