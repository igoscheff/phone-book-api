import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { userMessage } from '../messages/user.message';
import { roleEnum } from '../enums/role.enum';

export class CreateUserDto {

  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly firstName: string

  @ApiPropertyOptional()
  @IsEnum(roleEnum)
  @IsOptional()
  readonly roles: string[]

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})/,
    { message: userMessage.WEEK_PASSWORD },
  )
  password: string

}
