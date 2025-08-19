import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { StudentSchema } from './student.schema';
import { RfidModule } from '../rfid/rfid.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Student', schema: StudentSchema }]),
    RfidModule,
  ],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
