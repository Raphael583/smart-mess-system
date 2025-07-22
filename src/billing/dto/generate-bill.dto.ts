
import { IsString } from 'class-validator';

export class GenerateBillDto {
  @IsString()
  month: string; // e.g., "July 2025"

}
