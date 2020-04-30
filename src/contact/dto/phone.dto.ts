import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator'
import { phoneTypeEnum } from '../enums/phone-type.enum'

export class PhoneDto {

  @ApiProperty()
  @IsEnum(phoneTypeEnum)
  @IsNotEmpty()
  readonly type: string

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  phoneNumber: number

}
