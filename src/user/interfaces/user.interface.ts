import { Document } from 'mongoose';

export interface IUser extends Document {
  readonly email: string
  status: string
  readonly firstName: string
  readonly roles: Array<string>
  readonly password: string
}

