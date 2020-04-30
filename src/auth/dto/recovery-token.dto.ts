import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RecoveryTokenDto {

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  token: string

}
