import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Admin, AdminDocument } from '../admin/schemas/admin.schema.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const admin = await this.adminModel.findOne({ email: dto.email.toLowerCase() }).exec();
    if (!admin) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, admin.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    await this.adminModel.findByIdAndUpdate(admin._id, { lastLoginAt: new Date() });

    const payload = { sub: admin._id.toString(), email: admin.email };
    return {
      accessToken: this.jwtService.sign(payload),
      admin: { id: admin._id, email: admin.email, name: admin.name, role: admin.role },
    };
  }

  async getMe(adminId: string) {
    const admin = await this.adminModel.findById(adminId).select('-passwordHash').exec();
    if (!admin) throw new UnauthorizedException();
    return admin;
  }
}
