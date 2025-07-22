// src/admin/dto/update-admin.dto.ts
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateAdminDto {
  id: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
