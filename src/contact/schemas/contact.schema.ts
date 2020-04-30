import * as mongoose from 'mongoose'
import { PhoneSchema } from './phone.schema'
import { EmailSchema } from './email.schema'
import { AddressSchema } from './address.schema'

export const ContactSchema = new mongoose.Schema({
  uId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  photoSrc: {
    type: String,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  company: {
    type: String,
  },
  phones: {
    type: [PhoneSchema],
  },
  emails: {
    type: [EmailSchema],
  },
  addresses: {
    type: [AddressSchema],
  },
  birthday: {
    type: Date,
  },
})
