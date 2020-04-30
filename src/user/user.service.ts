import { ConflictException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as crypt from 'bcryptjs'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { IUser } from './interfaces/user.interface'
import { userMessage } from './messages/user.message'

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {
  }

  async findAll(): Promise<IUser[]> {
    return await this.userModel.find().exec()
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
      throw new ConflictException(userMessage.USER_WITH_THIS_EMAIL_ALREADY_EXISTS)
    }

    const createdUser = new this.userModel(payload)
    return await createdUser.save()
  }

  async update(id: string, payload: UpdateUserDto): Promise<IUser> {
    return await this.userModel.findOneAndUpdate(
      { _id: id },
      { $set: payload },
      { new: true },
    ).exec()
  }

  async remove(id: string): Promise<object> {
    await this.userModel.remove({ _id: id })
    return { message: userMessage.USER_WAS_SUCCESSFULLY_DELETED }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10
    const salt = await crypt.genSalt(saltRounds)
    return await crypt.hash(password, salt)
  }

}
