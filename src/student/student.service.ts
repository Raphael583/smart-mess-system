import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from './student.interface';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { RfidService } from 'src/rfid/rfid.service';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel('Student') private studentModel: Model<Student>,
    private readonly rfidService: RfidService,
  ) {}

 async create(dto: CreateStudentDto): Promise<Student> {
  const rawUID = this.rfidService.getUID();

  console.log('🔍 UID from memory before student creation:', rawUID);

  if (!rawUID) {
    throw new BadRequestException('RFID UID expired or not received. Please tap your RFID again.');
  }

  const cleanedUID = rawUID.replace(/^UID:\s*/i, '').trim();

  if (!cleanedUID) {
    throw new BadRequestException('Invalid RFID UID scanned.');
  }

  const student = new this.studentModel({ ...dto, rfidUID: cleanedUID });

  try {
    return await student.save();
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      throw new BadRequestException(
        `Duplicate entry: A student with the same ${field} already exists.`
      );
    }
    throw err; // fallback to default
  }
}


  async findAll(): Promise<Student[]> {
    return this.studentModel.find().exec();
  }

  async findByUID(rfidUID: string): Promise<Student> {
    const student = await this.studentModel.findOne({ rfidUID }).exec();
    if (!student) {
      throw new NotFoundException(
        `Student with RFID UID ${rfidUID} not found`,
      );
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
