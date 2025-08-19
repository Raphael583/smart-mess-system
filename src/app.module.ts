import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentModule } from './student/student.module';
import { MealLogModule } from './meal-log/meal-log.module';
import { BillingModule } from './billing/billing.module';
import { WeeklyMenuModule } from './weekly-menu/weekly-menu.module';
import { AdminModule } from './admin/admin.module';
import { RfidModule } from './rfid/rfid.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/mess_mng'),StudentModule, MealLogModule, BillingModule, WeeklyMenuModule, AdminModule, RfidModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
