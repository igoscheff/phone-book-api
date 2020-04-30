import { Document } from 'mongoose'

export interface IPhone extends Document {

  uId: string
  contactId: string
  readonly type: string
  phoneNumber: number

}
