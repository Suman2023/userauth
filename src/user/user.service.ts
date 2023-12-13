import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async createProfile(email: string): Promise<boolean> {
    const userProfile = await this.userModel.create({ email: email });
    return userProfile != null;
  }

  async getProfile() {
    return true;
  }
}
