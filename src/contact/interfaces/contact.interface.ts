import { Document } from 'mongoose'
import { IPhone } from './phone.interface'
import { IEmail } from './email.interface'
import { IAddress } from './address.interface'

export interface IContact extends Document {

  uId: string
  photoSrc?: string
  readonly firstName: string
  readonly lastName?: string
  readonly company?: string
  readonly phones?: Array<IPhone>
  readonly emails?: Array<IEmail>
  readonly addresses?: Array<IAddress>
  readonly birthday?: Date

}

