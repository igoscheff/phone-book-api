import * as mongoose from 'mongoose'
import { roleEnum } from '../enums/role.enum'
import { statusEnum } from '../enums/status.enum'

export const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: Object.values(statusEnum),
    default: statusEnum.pending,
  },
  firstName: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    required: true,
    default: 'user',
    enum: Object.values(roleEnum),
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: {
    type: String,
  },
  resetTokenExp: {
    type: Date,
  },
})




