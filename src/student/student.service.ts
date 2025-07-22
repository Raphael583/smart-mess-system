import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from './student.interface';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(@InjectModel('Student') private studentModel: Model<Student>) {}

  async create(dto: CreateStudentDto): Promise<Student> {
    const student = new this.studentModel(dto);
    return student.save();
  }

  async findAll(): Promise<Student[]> {
    return this.studentModel.find().exec();
  }

  async findByUID(rfidUID: string): Promise<Student> {
    const student = await this.studentModel.findOne({ rfidUID }).exec();
    if (!student) {
      throw new NotFoundException(`Student with RFID UID ${rfidUID} not found`);
    }
    return student;
  }

  async update(id: string, dto: UpdateStudentDto): Promise<Student> {
    const updatedStudent = await this.studentModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updatedStudent) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return updatedStudent;
  }

  async remove(id: string): Promise<{ message: string }> {
    const deletedStudent = await this.studentModel.findByIdAndDelete(id).exec();
    if (!deletedStudent) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return { message: 'Student deleted successfully' };
  }
}
