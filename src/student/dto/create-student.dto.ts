import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEmail,
  IsEnum,
  Length,
} from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Department number is required' })
  deptNo: string;

  @IsNumber({}, { message: 'Year must be a number' })
  year: number;

  @IsString()
  @Length(10, 10, { message: 'Phone number must be 10 digits' })
  phoneNumber: string;

  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsEnum(['Veg', 'Non-Veg'], {
    message: 'Mess type must be either "Veg" or "Non-Veg"',
  })
  messType: 'Veg' | 'Non-Veg';

  @IsString()
  @IsNotEmpty({ message: 'Room number is required' })
  roomNumber: string;
}
