import { Body, Controller, Delete, Get, Param, Patch, Post, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { IUser } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('User')
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get()
  async findAll(): Promise<IUser[]> {
    return this.userService.findAll()
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<IUser> {
    return  this.userService.findById(id)
  }

  @Post()
  async create(@Body(new ValidationPipe()) payload: CreateUserDto): Promise<IUser> {
    return this.userService.create(payload)
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body(new ValidationPipe()) payload: UpdateUserDto): Promise<IUser> {
    return this.userService.update(id, payload)
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<object> {
    return this.userService.remove(id)
  }

  /*@Get('/email/:email')
  async findByEmail(@Param('email') email: string): Promise<IUser> {
    return  this.userService.findByEmail(email)
  }*/
}

