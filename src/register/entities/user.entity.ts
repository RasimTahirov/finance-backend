import { Category } from 'src/category/entities/category.entity';
import { FinanceLogic } from 'src/finance-logic/entities/finance-logic.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @OneToMany(() => Category, (category) => category.user, {
    onDelete: 'CASCADE',
  })
  categories: Category[];

  @OneToMany(() => FinanceLogic, (finance) => finance.user)
  finance: FinanceLogic[];

  @Column({ nullable: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;
}
