import { Body, Controller, Get, Post, Query, ValidationPipe } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { AuthService } from './auth.service'
import { IReadableUser } from '../user/interfaces/readable-user.interface'
import { LoginDto } from './dto/login.dto'
import { CreateUserDto } from '../user/dto/create-user.dto'
import { ConfirmAccountDto } from './dto/confirm-account.dto'
import { ResetPasswordEmailDto } from './dto/reset-password-email.dto'
import { RecoveryPasswordDto } from './dto/recovery-password.dto'
import { RecoveryTokenDto } from './dto/recovery-token.dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('/registration')
  async signUp(@Body(new ValidationPipe()) createUserDto: CreateUserDto): Promise<boolean> {
    return this.authService.register(createUserDto)
  }

  @Post('/login')
  async login(@Body(new ValidationPipe()) payload: LoginDto): Promise<IReadableUser> {
    return await this.authService.login(payload)
  }

  @Get('/confirm-registration')
  async confirm(@Query(new ValidationPipe()) query: ConfirmAccountDto): Promise<any> {
    return await this.authService.confirm(query.token)
  }

  @Post('/reset-password')
  async resetPassword(@Body(new ValidationPipe()) payload: ResetPasswordEmailDto): Promise<any> {
    return await this.authService.resetPassword(payload)
  }

  @Post('/create-new-password')
  async createNewPassword(@Body(new ValidationPipe()) password: RecoveryPasswordDto, @Query(new ValidationPipe()) token: RecoveryTokenDto): Promise<any> {
    return await this.authService.createNewPassword(password, token)
  }
}
