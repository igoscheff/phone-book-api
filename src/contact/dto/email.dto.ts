import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator'
import { emailTypeEnum } from '../enums/email-type.enum'

export class EmailDto {

  @ApiProperty()
  @IsEnum(emailTypeEnum)
  @IsNotEmpty()
  readonly type: string

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly email: string

}
