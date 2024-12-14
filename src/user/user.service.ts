import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const checkEmail = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (checkEmail)
      throw new BadRequestException(
        'Пользователь с данным email уже существует',
      );

    const passwordHashed = await argon2.hash(createUserDto.password);

    const user = this.userRepository.create({
      email: createUserDto.email,
      name: createUserDto.name,
      password: passwordHashed,
    });

    const userSave = await this.userRepository.save(user);
    const token = this.jwtService.sign({ email: createUserDto.email });

    return { token, userSave };
  }
}
