import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BillingSchema } from './billing.schema';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { MealLogSchema } from '../meal-log/schemas/meal-log.schema';
import { WeeklyMenuSchema } from '../weekly-menu/schemas/weekly-menu.schema';
import { StudentSchema } from '../student/student.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Billing', schema: BillingSchema },
      { name: 'MealLog', schema: MealLogSchema },
      { name: 'WeeklyMenu', schema: WeeklyMenuSchema },
      { name: 'Student', schema: StudentSchema },
    ]),
  ],
  providers: [BillingService],
  controllers: [BillingController],
})
export class BillingModule {}
