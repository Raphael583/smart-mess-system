import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { StudentSchema } from './student.schema';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
   imports: [MongooseModule.forFeature([{ name: 'Student', schema: StudentSchema }])],
  controllers: [StudentController],
  providers: [StudentService]
})
export class StudentModule {}
