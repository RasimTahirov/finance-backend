import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterService } from 'src/register/register.service';
import * as argon2 from 'argon2';
import { IUser } from 'src/model/user';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly RegisterService: RegisterService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.RegisterService.findOne(email);
    const isPasswordValid = await argon2.verify(user.password, password);

    if (user && isPasswordValid) return user;

    throw new UnauthorizedException('Неверный пароль или логин');
  }

  async login(user: IUser) {
    const { id, email, name } = user;

    return {
      id,
      email,
      name,
      token: this.jwtService.sign({
        id: user.id,
        email: user.email,
        name: user.name,
      }),
    };
  }
}
