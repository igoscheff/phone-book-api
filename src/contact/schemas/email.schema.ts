import * as mongoose from 'mongoose'
import { emailTypeEnum } from '../enums/email-type.enum'

export const EmailSchema = new mongoose.Schema({
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
    enum: Object.values(emailTypeEnum),
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
})
