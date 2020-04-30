import { IsEmail, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ResetPasswordEmailDto {

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string

}
