import { Document } from 'mongoose'

export interface IAddress extends Document {

  uId: string
  contactId: string
  readonly type: string
  readonly addressLine1: string
  readonly addressLine2?: string
  readonly zip: number
  readonly city: string
  readonly country: string

}
