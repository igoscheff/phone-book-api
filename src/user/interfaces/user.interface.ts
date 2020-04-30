import { Document } from 'mongoose'

export interface IUser extends Document {

  readonly email: string
  status: string
  readonly firstName: string
  readonly roles: Array<string>
  password: string
  resetToken?: string
  resetTokenExp?: Date

}

