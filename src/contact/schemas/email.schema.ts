import * as mongoose from 'mongoose'
import { emailTypeEnum } from '../enums/email-type.enum'

export const EmailSchema = new mongoose.Schema({

  type: {
    type: String,
    enum: Object.values(emailTypeEnum),
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
})
