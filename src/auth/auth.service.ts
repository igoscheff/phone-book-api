import { ConfigService } from '@nestjs/config'
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  MethodNotAllowedException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { JwtService } from '@nestjs/jwt'
import { SignOptions } from 'jsonwebtoken'
import * as crypt from 'bcryptjs'
import * as moment from 'moment'
import * as _ from 'lodash'
import * as crypto from 'crypto'

import { UserService } from '../user/user.service'
import { TokenService } from '../token/token.service'
import { MailService } from '../mail/mail.service'
import { IReadableUser } from '../user/interfaces/readable-user.interface'
import { ITokenPayload } from './interfaces/token-payload.interface'
import { IUser } from '../user/interfaces/user.interface'
import { userSensitiveFieldsEnum } from '../user/enums/protected-fields.enum'
import { statusEnum } from '../user/enums/status.enum'
import { CreateUserTokenDto } from '../token/dto/create-user-token.dto'
import { CreateUserDto } from '../user/dto/create-user.dto'
import { LoginDto } from './dto/login.dto'
import { ResetPasswordEmailDto } from './dto/reset-password-email.dto'
import { RecoveryPasswordDto } from './dto/recovery-password.dto'
import { RecoveryTokenDto } from './dto/recovery-token.dto'
import { AuthMessage } from './messages/auth.message'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {
    this.clientAppUrl = this.configService.get<string>('FE_APP_URL')
  }

  private readonly clientAppUrl: string

  async login({ email, password }: LoginDto): Promise<IReadableUser> {
    const user = await this.userService.findByEmail(email)

    if (user && (await crypt.compare(password, user.password))) {
      if (user.status !== statusEnum.active) {
        throw new MethodNotAllowedException()
      }
      const tokenPayload: ITokenPayload = {
        _id: user._id,
        status: user.status,
        roles: user.roles,
      }
      const token = await this.generateToken(tokenPayload)
      const expireAt = moment()
        .add(1, 'day')
        .toISOString()

      await this.tokenService.removeAll(user._id)

      await this.saveToken({
        token,
        expireAt,
        uId: user._id,
      })

      const readableUser = user.toObject() as IReadableUser
      readableUser.accessToken = token

      return _.omit<any>(readableUser, Object.values(userSensitiveFieldsEnum)) as IReadableUser
    }
    throw new BadRequestException('Invalid credentials')
  }

  async register(createUserDto: CreateUserDto): Promise<any> {
    const user = await this.userService.create(createUserDto)
    return await this.sendConfirmation(user)
  }

  async sendConfirmation(user: IUser) {
    const expiresIn = 60 * 60 * 24 // 24 hours
    const tokenPayload = {
      _id: user._id,
      status: user.status,
      roles: user.roles,
    }
    const expireAt = moment()
      .add(1, 'day')
      .toISOString()

    const token = await this.generateToken(tokenPayload, { expiresIn })
    const confirmLink = `${this.clientAppUrl}/auth/confirm?token=${token}`

    await this.saveToken({ token, uId: user._id, expireAt })
    await this.mailService.send({
      to: user.email,
      from: this.configService.get<string>('EMAIL_FROM'),
      subject: 'Verify User',
      html: `
                <h3>Hello ${user.firstName}!</h3>
                <p>Please use this <a href="${confirmLink}">link</a> to confirm your account.</p>
            `,
    })
    return { message: AuthMessage.PLEASE_CONFIRM_EMAIL }
  }

  async confirm(token: string): Promise<any> {
    const data = await this.verifyToken(token)
    const user = await this.userService.findById(data._id)

    await this.tokenService.remove(data._id, token)

    if (user && user.status === statusEnum.pending) {
      user.status = statusEnum.active
      await user.save()
      return { message: AuthMessage.SUCCESSFULLY_COMPLETED_REGISTRATION }
    }
    throw new BadRequestException('Confirmation error')
  }

  async resetPassword(payload: ResetPasswordEmailDto): Promise<any> {
    const user = await this.userService.findByEmail(payload.email)

    if (user) {
      user.resetToken = AuthService.generatePasswordResetToken(32)
      user.resetTokenExp = new Date(Date.now() + 60 * 60 * 1000)
      await user.save()

      const recoveryLink = `${this.clientAppUrl}/auth/reset-password?token=${user.resetToken}`
      await this.mailService.send({
        to: user.email,
        from: this.configService.get<string>('EMAIL_FROM'),
        subject: 'Password recovery',
        html: `
                <h3>Hello ${user.firstName}!</h3>
                <p>Please use this <a href="${recoveryLink}">link</a> to recovery your password.</p>
              `,
      })

      return { message: AuthMessage.LINK_WAS_SENT }
    } else {
      throw new BadRequestException()
    }
  }

  async createNewPassword(password: RecoveryPasswordDto, token: RecoveryTokenDto): Promise<any> {
    const user = await this.userModel.findOne({
      resetToken: token.token,
      resetTokenExp: { $gt: new Date(Date.now()) },
    })
    if (user) {
      user.password = await this.userService.hashPassword(password.password)
      await user.save()
      return { message: AuthMessage.PASSWORD_SUCCESSFULLY_CHANGED }
    } else {
      throw new InternalServerErrorException()
    }
  }

  private static generatePasswordResetToken(size: number): string {
    const buffer = crypto.randomBytes(size)
    return buffer.toString('hex')
  }

  private async generateToken(data: ITokenPayload, options?: SignOptions): Promise<string> {
    return await this.jwtService.sign(data, options)
  }

  private async verifyToken(token): Promise<any> {
    try {
      const data = this.jwtService.verify(token) as ITokenPayload
      const tokenExists = await this.tokenService.exists(data._id, token)

      if (tokenExists) {
        return data
      }
      throw new UnauthorizedException()
    } catch (error) {
      throw new UnauthorizedException()
    }
  }

  private async saveToken(createUserTokenDto: CreateUserTokenDto) {
    return await this.tokenService.create(createUserTokenDto)
  }

}
