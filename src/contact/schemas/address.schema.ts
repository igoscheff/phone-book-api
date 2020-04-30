import * as mongoose from 'mongoose'
import { addressTypeEnum } from '../enums/address-type.enum'
import { countryEnum } from '../enums/country.enum'

export const AddressSchema = new mongoose.Schema({
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
    enum: Object.values(addressTypeEnum),
    required: true,
  },
  addressLine1: {
    type: String,
  },
  addressLine2: {
    type: String,
  },
  zip: {
    type: Number,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
    enum: Object.values(countryEnum),
  },
})
