import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/register/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class FinanceLogic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  amount: number;

  @Column()
  type: string;

  @ManyToOne(() => User, (user) => user.finance)
  user: User;

  @ManyToOne(() => Category, (category) => category.finance)
  category: Category;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
