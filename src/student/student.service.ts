// src/student/student.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from './student.interface';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentService {
  constructor(@InjectModel('Student') private readonly studentModel: Model<Student>) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const existing = await this.studentModel.findOne({ uid: createStudentDto.uid });
    if (existing) {
      throw new ConflictException('Student with this UID already exists');
    }
    const student = new this.studentModel(createStudentDto);
    return student.save();
  }

  async findAll(): Promise<Student[]> {
    return this.studentModel.find();
  }
}
