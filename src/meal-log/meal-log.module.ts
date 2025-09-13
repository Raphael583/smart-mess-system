import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MealLogController } from './meal-log.controller';
import { MealLogService } from './meal-log.service';
import { MealLogSchema } from './schemas/meal-log.schema';
import { StudentSchema } from '../student/student.schema';
import { WeeklyMenuSchema } from '../weekly-menu/schemas/weekly-menu.schema';
import { RfidModule } from '../rfid/rfid.module'; 
import { MealSessionController } from './meal-session.controller';
import { MealSessionService } from './meal-session.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'MealLog', schema: MealLogSchema },
      { name: 'Student', schema: StudentSchema },
      { name: 'WeeklyMenu', schema: WeeklyMenuSchema },
    ]),
    RfidModule,
  ],
  controllers: [MealLogController, MealSessionController],
  providers: [MealLogService, MealSessionService ], 
  exports: [MongooseModule],
})
export class MealLogModule {}
