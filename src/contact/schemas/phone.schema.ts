import * as mongoose from 'mongoose'
import { phoneTypeEnum } from '../enums/phone-type.enum'

export const PhoneSchema = new mongoose.Schema({

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
