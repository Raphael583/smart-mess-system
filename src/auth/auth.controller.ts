import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAdminDto } from './dto/login-admin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginAdminDto) {
    const admin = await this.authService.validateAdmin(dto.username, dto.password);
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { message: 'Login successful', adminId: admin._id, username: admin.username };
  }
}
