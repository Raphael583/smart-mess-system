// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSchema } from './schemas/admin.schema';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MealLogModule } from '../meal-log/meal-log.module'; // 👈 Import MealLogModule
import { BillingSchema } from '../billing/billing.schema';
import { StudentSchema } from '../student/student.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Admin', schema: AdminSchema },
      { name: 'Billing', schema: BillingSchema },
      { name: 'Student', schema: StudentSchema },
    ]),
    MealLogModule, // 👈 Add it here so MealLogModel is available
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
