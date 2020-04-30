import * as mongoose from 'mongoose'
import { phoneTypeEnum } from '../enums/phone-type.enum'

export const PhoneSchema = new mongoose.Schema({
  uId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  contactId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Contact'
  },
  type: {
    type: String,
    enum: Object.values(phoneTypeEnum),
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
})
