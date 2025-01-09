import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRegisterDto } from './dto/create-register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createRegisterDto: CreateRegisterDto) {
    const checkEmail = await this.userRepository.findOne({
      where: {
        email: createRegisterDto.email,
      },
    });

    if (checkEmail)
      throw new BadRequestException(
        'Пользователь с данным email уже существует',
      );

    const passwordHashed = await argon2.hash(createRegisterDto.password);

    const user = this.userRepository.create({
      email: createRegisterDto.email,
      name: createRegisterDto.name,
      password: passwordHashed,
    });

    const userSave = await this.userRepository.save(user);
    const token = this.jwtService.sign({ email: createRegisterDto.email });

    return { token, userSave };
  }

  async findOne(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }
}
