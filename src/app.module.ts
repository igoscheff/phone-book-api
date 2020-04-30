import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { configModule } from './config.root'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { TokenModule } from './token/token.module'
import { MailModule } from './mail/mail.module'
import { ContactModule } from './contact/contact.module'
import { SearchModule } from './search/search.module'

@Module({
  imports: [
    configModule,
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION,
      { useNewUrlParser: true, useUnifiedTopology: true }),
    UserModule,
    AuthModule,
    TokenModule,
    MailModule,
    ContactModule,
    SearchModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
