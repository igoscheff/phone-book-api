import { Body, Controller, Get, Post, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { IReadableUser } from '../user/interfaces/readable-user.interface'
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ConfirmAccountDto } from './dto/confirm-account.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async signUp(@Body(new ValidationPipe()) createUserDto: CreateUserDto): Promise<boolean> {
    return this.authService.register(createUserDto);
  }

  @Post('/login')
  async login(@Body(new ValidationPipe()) payload: LoginDto): Promise<IReadableUser> {
    return await this.authService.login(payload);
  }

  @Get('/confirm')
  async confirm(@Query(new ValidationPipe()) query: ConfirmAccountDto): Promise<boolean> {
    await this.authService.confirm(query.token);
    return true;
  }

}
