import {
  Body,
  Controller, Delete,
  Get,
  Param, Patch,
  Post,
  Req, UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common'
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiImplicitFile } from '@nestjs/swagger/dist/decorators/api-implicit-file.decorator'

import { configFileUpload } from './config.file-upload'
import { ContactService } from './contact.service'
import { IContact } from './interfaces/contact.interface'
import { ContactDto } from './dto/contact.dto'

@ApiTags('Contact')
@ApiBearerAuth('JWT')
@UseGuards(AuthGuard('jwt'))
@Controller('api/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {
  }

  @Get()
  async findAll(@Req() request): Promise<IContact[]> {
    return await this.contactService.findAll(request)
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<IContact> {
    return await this.contactService.findById(id)
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({ name: 'avatar' })
  @UseInterceptors(FileInterceptor('file', configFileUpload))
  async create(@UploadedFile() file, @Req() request, @Body(new ValidationPipe({ transform: true })) payload: ContactDto): Promise<IContact> {
    return await this.contactService.create(request, payload, file)
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({ name: 'avatar' })
  @UseInterceptors(FileInterceptor('file', configFileUpload))
  async update(@UploadedFile() file, @Param('id') id: string, @Body(new ValidationPipe({ transform: true })) payload: ContactDto): Promise<IContact> {
    return await this.contactService.update(id, payload, file)
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<object> {
    return await this.contactService.remove(id)
  }

}
