import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Admin, AdminDocument } from './schemas/admin.schema.js';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  async createAdmin(email: string, password: string, name: string) {
    const existing = await this.adminModel.findOne({ email }).exec();
    if (existing) throw new ConflictException('Admin with this email already exists');

    const passwordHash = await bcrypt.hash(password, 12);
    return this.adminModel.create({ email, passwordHash, name, role: 'super-admin' });
  }
}
