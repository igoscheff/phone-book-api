import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { ContactModule } from '../contact/contact.module'

@Module({
  imports: [
    ContactModule
  ],
  providers: [SearchService],
  controllers: [SearchController]
})
export class SearchModule {}
