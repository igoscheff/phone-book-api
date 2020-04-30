import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { SearchService } from './search.service'
import { ContactService } from '../contact/contact.service'
import { IContact } from '../contact/interfaces/contact.interface'
import { SearchKeyDto } from './dto/search-key.dto'

@ApiTags('Search')
@ApiBearerAuth('JWT')
@UseGuards(AuthGuard('jwt'))
@Controller('api/search')
export class SearchController {
  constructor(private readonly searchService: SearchService,
              private readonly contactService: ContactService) {
  }

  @Post()
  async contactSearch(@Req() request, @Body(new ValidationPipe()) payload: SearchKeyDto): Promise<IContact[]> {
    const collection: IContact[] = await this.contactService.findAll(request)
    return await this.searchService.contactSearch(collection, payload)
  }

}
