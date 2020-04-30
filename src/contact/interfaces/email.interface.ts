import { Document } from 'mongoose'

export interface IEmail extends Document {

  uId: string
  contactId: string
  readonly type: string
  readonly email: string

}
