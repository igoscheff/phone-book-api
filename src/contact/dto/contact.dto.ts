import {
  IsArray,
  IsDateString, IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { PhoneDto } from './phone.dto'
import { EmailDto } from './email.dto'
import { AddressDto } from './address.dto'

export class ContactDto {

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  photoSrc?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
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

