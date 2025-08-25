import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from 'src/admin/interfaces/admin.interface';

@Injectable()
export class AuthService {
  constructor(@InjectModel('Admin') private adminModel: Model<Admin>) {}

  async validateAdmin(username: string, password: string): Promise<Admin | null> {
    const admin = await this.adminModel.findOne({ username, password }).exec();
    return admin || null;
  }
}
