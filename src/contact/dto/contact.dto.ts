import {
  IsArray,
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { PhoneDto } from './phone.dto'
import { EmailDto } from './email.dto'
import { AddressDto } from './address.dto'
import { IPhone } from '../interfaces/phone.interface'
import { IEmail } from '../interfaces/email.interface'
import { IAddress } from '../interfaces/address.interface'

export class CreateContactDto {

  /*@ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly uId?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly photoSrc?: string*/

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly firstName: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly lastName?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly company?: string

  @ApiPropertyOptional({type: [PhoneDto]})
  @IsArray()
  @IsOptional()
  readonly phones?: PhoneDto[]

  @ApiPropertyOptional({type: [EmailDto]})
  @IsArray()
  @IsOptional()
  readonly emails?: EmailDto[]

  @ApiPropertyOptional({type: [AddressDto]})
  @IsArray()
  @IsOptional()
  readonly addresses?: AddressDto[]

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  readonly birthday?: string

}

