import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(3, 20)
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(3)
  password: string;
}
