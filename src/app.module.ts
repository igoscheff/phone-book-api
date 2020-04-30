import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { configModule } from './configure.root';
import { MailModule } from './mail/mail.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    configModule,
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION,
      { useNewUrlParser: true, useUnifiedTopology: true }),
    UserModule,
    AuthModule,
    TokenModule,
    MailModule,
    ContactModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
