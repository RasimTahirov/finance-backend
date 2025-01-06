import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/register/entities/user.entity';

export class CreateFinanceLogicDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsString()
  type: 'Income' | 'Expenses';

  @IsNotEmpty()
  category: Category;
  user: User;
}
