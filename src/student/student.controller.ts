import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  create(@Body() dto: CreateStudentDto) {
    return this.studentService.create(dto);
  }
 @Get('count')
  async getTotalStudents() {
    const count = await this.studentService.getTotalStudents();
    return { totalStudents: count };
  }

  @Get()
  findAll() {
    return this.studentService.findAll();
  }

  @Get('rfid/:uid')
  findByRFID(@Param('uid') uid: string) {
    return this.studentService.findByUID(uid);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.studentService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }
}
