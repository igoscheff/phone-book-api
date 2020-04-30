import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class SearchKeyDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  readonly searchKey: string

}
