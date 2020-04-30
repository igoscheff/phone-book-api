import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { IContact } from './interfaces/contact.interface'
import { ContactDto } from './dto/contact.dto'
import { contactMessage } from './messages/contact.message'

@Injectable()
export class ContactService {
  constructor(@InjectModel('Contact') private readonly contactModel: Model<IContact>) {
  }

  async create(request, payload: ContactDto, file): Promise<IContact> {
    if (payload.firstName) {
      const contact = new this.contactModel(payload)

      contact.uId = request.user._id
      contact.photoSrc = file.filename

      return await contact.save()
    } else {
      throw new BadRequestException(contactMessage.NAME_MUST_BE_DEFINED)
    }
  }

  async findAll(request): Promise<IContact[]> {
    return await this.contactModel.find({ uId: request.user._id }).exec()
  }

  async findById(id: string): Promise<IContact> {
    return await this.contactModel.findOne({ _id: id }).exec()
  }

  async update(id: string, payload, file): Promise<IContact> {
    payload.photoSrc = file.filename
    return await this.contactModel.findOneAndUpdate(
      { _id: id },
      { $set: payload },
      { new: true },
    ).exec()
  }

  async remove(id: string): Promise<object> {
    await this.contactModel.remove({ _id: id })
    return { message: contactMessage.CONTACT_WAS_SUCCESSFULLY_DELETED }
  }

}
