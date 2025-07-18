// src/student/dto/create-student.dto.ts
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateStudentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  deptNo: string;

  @IsNotEmpty()
  @IsString()
  uid: string;

  @IsEmail()
  email: string;

  @Matches(/^[6-9]\d{9}$/, {
    message: 'Phone number must be valid Indian mobile number',
  })
  phone: string;
}
