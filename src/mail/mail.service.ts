import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { IMailSandGridData } from './interfaces/mail.interface'
import * as mailer from '@sendgrid/mail'

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {
    mailer.setApiKey(process.env.SENDGRID_API_KEY)
  }

  async send(data: IMailSandGridData) {
    try {
      await mailer.send(data)
    } catch (error) {
      console.error(error)

      if (error.response) {
        console.error(error.response.body)
      }
    }
  }

}
