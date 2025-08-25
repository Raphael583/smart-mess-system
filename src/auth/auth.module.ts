import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminSchema } from 'src/admin/schemas/admin.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Admin', schema: AdminSchema }])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
