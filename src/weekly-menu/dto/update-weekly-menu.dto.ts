import { PartialType } from '@nestjs/mapped-types';
import { CreateWeeklyMenuDto } from './create-weekly-menu.dto';

export class UpdateWeeklyMenuDto extends PartialType(CreateWeeklyMenuDto) {}
