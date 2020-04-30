import { BadRequestException, Injectable, MethodNotAllowedException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto'
import { IReadableUser } from '../user/interfaces/readable-user.interface'
import { UserService } from '../user/user.service'
import * as crypt from 'bcryptjs'
import { statusEnum } from '../user/enums/status.enum'
import { ITokenPayload } from './interfaces/token-payload.interface'
import { SignOptions } from 'jsonwebtoken'
import { JwtService } from '@nestjs/jwt'
import * as moment from 'moment'
import { CreateUserTokenDto } from '../token/dto/create-user-token.dto'
import { TokenService } from '../token/token.service'
import * as _ from 'lodash'
import { userSensitiveFieldsEnum } from '../user/enums/protected-fields.enum'
import { CreateUserDto } from '../user/dto/create-user.dto';
import { IUser } from '../user/interfaces/user.interface';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService
  ) {
    this.clientAppUrl = this.configService.get<string>('FE_APP_URL');
  }

  private readonly clientAppUrl: string;

  async register(createUserDto: CreateUserDto): Promise<boolean> {
    const user = await this.userService.create(createUserDto);
    await this.sendConfirmation(user);
    return true;
  }

  async login({ email, password }: LoginDto): Promise<IReadableUser> {
    const user = await this.userService.findByEmail(email);

    if (user && (await crypt.compare(password, user.password))) {
      if (user.status !== statusEnum.active) {
        throw new MethodNotAllowedException();
      }
      const tokenPayload: ITokenPayload = {
        _id: user._id,
        status: user.status,
        roles: user.roles,
      };
      const token = await this.generateToken(tokenPayload);
      const expireAt = moment()
        .add(1, 'day')
        .toISOString();

      await this.saveToken({
        token,
        expireAt,
        uId: user._id,
      });

      const readableUser = user.toObject() as IReadableUser;
      readableUser.accessToken = token;

      return _.omit<any>(readableUser, Object.values(userSensitiveFieldsEnum)) as IReadableUser;
    }
    throw new BadRequestException('Invalid credentials');
  }

  async confirm(token: string): Promise<IUser> {
    const data = await this.verifyToken(token);
    const user = await this.userService.findById(data._id);

    await this.tokenService.remove(data._id, token);

    if (user && user.status === statusEnum.pending) {
      user.status = statusEnum.active;
      return user.save();
    }
    throw new BadRequestException('Confirmation error');
  }

  async sendConfirmation(user: IUser) {
    const expiresIn = 60 * 60 * 24; // 24 hours
    const tokenPayload = {
      _id: user._id,
      status: user.status,
      roles: user.roles,
    };
    const expireAt = moment()
      .add(1, 'day')
      .toISOString();

    const token = await this.generateToken(tokenPayload, { expiresIn });
    const confirmLink = `${this.clientAppUrl}/auth/confirm?token=${token}`;

    await this.saveToken({ token, uId: user._id, expireAt });
    await this.mailService.send({
      to: user.email,
      from: this.configService.get<string>('EMAIL_FROM'),
      subject: 'Verify User',
      html: `
                <h3>Hello ${user.firstName}!</h3>
                <p>Please use this <a href="${confirmLink}">link</a> to confirm your account.</p>
            `,
    });
  }

  private async generateToken(data: ITokenPayload, options?: SignOptions): Promise<string> {
    return await this.jwtService.sign(data, options)
  }

  private async verifyToken(token): Promise<any> {
    try {
      const data = this.jwtService.verify(token) as ITokenPayload;
      const tokenExists = await this.tokenService.exists(data._id, token);

      if (tokenExists) {
        return data;
      }
      throw new UnauthorizedException();
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private async saveToken(createUserTokenDto: CreateUserTokenDto) {
    const userToken = await this.tokenService.create(createUserTokenDto);

    return userToken;
  }

}
