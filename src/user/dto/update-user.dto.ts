import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { roleEnum } from '../enums/role.enum';

export class UpdateUserDto {

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email: string

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly firstName: string

  @ApiPropertyOptional()
  @IsEnum(roleEnum)
  @IsOptional()
  readonly roles: string[]

}
