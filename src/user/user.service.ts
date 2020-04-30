import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypt from 'bcryptjs';

import { IUser } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailAlreadyExistException } from './exeptions/user.exeption';
import { userMessage } from './messages/user.message';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

  private readonly saltRounds = 10;

  async hashPassword(password: string): Promise<string> {
    const salt = await crypt.genSalt(this.saltRounds);
    return await crypt.hash(password, salt);
  }

  async findAll(): Promise<IUser[]> {
    return await this.userModel.find().exec();
  }

  async findById(id: string): Promise<IUser> {
    return await this.userModel.findOne({ _id: id }).exec()
  }

  async findByEmail(email: string): Promise<IUser> {
    return await this.userModel.findOne({ email: email }).exec()
  }

  async create(payload: CreateUserDto): Promise<IUser> {
    const existEmail = await this.userModel.findOne({ email: payload.email })

    if (!existEmail) {
      payload.password = await this.hashPassword(payload.password)
    } else {
      throw new EmailAlreadyExistException()
    }

    const createdUser = new this.userModel(payload);
    return await createdUser.save();
  }

  async update(id: string, payload: UpdateUserDto): Promise<IUser> {
    return await this.userModel.findOneAndUpdate(
      { _id: id },
      { $set: payload },
      { new: true }
      ).exec()
  }

  async remove(id: string): Promise<object> {
    await this.userModel.remove(
      { _id: id }
    )
    return { message: userMessage.USER_WAS_SUCCESSFULLY_DELETED }
  }

}
