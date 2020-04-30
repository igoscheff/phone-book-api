import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { addressTypeEnum } from '../enums/address-type.enum'
import { countryEnum } from '../enums/country.enum'

export class AddressDto {

  @ApiProperty()
  @IsEnum(addressTypeEnum)
  @IsNotEmpty()
  readonly type: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly addressLine1: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly addressLine2: string

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly zip: number

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly city: string

  @ApiProperty()
  @IsEnum(countryEnum)
  @IsNotEmpty()
  readonly country: string

}
