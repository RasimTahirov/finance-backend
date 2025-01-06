import { Module } from '@nestjs/common';
import { FinanceLogicService } from './finance-logic.service';
import { FinanceLogicController } from './finance-logic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceLogic } from './entities/finance-logic.entity';
import { Category } from 'src/category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FinanceLogic, Category])],
  controllers: [FinanceLogicController],
  providers: [FinanceLogicService],
})
export class FinanceLogicModule {}
