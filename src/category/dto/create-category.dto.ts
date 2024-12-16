import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  // @IsNotEmpty()
  @IsOptional() // Временно, подключить S3 при фронте!!!!!
  @IsString()
  image?: string;

  @IsNotEmpty()
  @IsString()
  title: string;
}
