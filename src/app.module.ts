import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentModule } from './student/student.module';
import { MealLogModule } from './meal-log/meal-log.module';
import { BillingModule } from './billing/billing.module';
import { WeeklyMenuModule } from './weekly-menu/weekly-menu.module';
import { AdminModule } from './admin/admin.module';
import { RfidModule } from './rfid/rfid.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    // Serve the public folder (login.html etc.) from outside src
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/', // optional, default is '/'
    }),

    // MongoDB connection
    MongooseModule.forRoot('mongodb://localhost:27017/mess_mng'),

    // Your application modules
    StudentModule,
    MealLogModule,
    BillingModule,
    WeeklyMenuModule,
    AdminModule,
    RfidModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
