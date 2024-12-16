import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateFinanceLogicDto } from './dto/create-finance-logic.dto';
import { Repository } from 'typeorm';
import { FinanceLogic } from './entities/finance-logic.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class FinanceLogicService {
  constructor(
    @InjectRepository(FinanceLogic)
    private readonly financeRepository: Repository<FinanceLogic>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createFinanceLogicDto: CreateFinanceLogicDto, id: number) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id: +createFinanceLogicDto.category },
      });

      if (!category) {
        throw new NotFoundException('Категория не найдена');
      }

      const finance = {
        title: createFinanceLogicDto.title,
        amount: createFinanceLogicDto.amount,
        type: createFinanceLogicDto.type,
        category,
        user: { id },
      };

      return await this.financeRepository.save(finance);
    } catch (error) {
      console.error('ошибка при создании операции', error);
      throw new InternalServerErrorException('Не удалось создать операцию');
    }
  }

  async findAll(id: number) {
    try {
      const finance = await this.financeRepository.find({
        where: {
          user: { id },
        },
        relations: {
          category: true,
        },
      });

      return finance;
    } catch (error) {
      console.error('Ошибка при загрузке операций', error);
      throw new InternalServerErrorException('Не удалось загрузить операции');
    }
  }

  async findOne(id: number) {
    try {
      const finance = await this.financeRepository.findOne({
        where: { id },
        relations: {
          user: true,
        },
      });

      return finance;
    } catch (error) {
      console.error('Ошибка при загрузке операции', error);
      throw new InternalServerErrorException('Не удалось загрузить операцию');
    }
  }

  async remove(id: number) {
    const finance = await this.financeRepository.findOne({
      where: { id },
    });

    if (!finance) {
      throw new NotFoundException('Операция не найдена');
    }

    try {
      return await this.financeRepository.delete(id);
    } catch (error) {
      console.error('Ошибка при удалении операции', error);
      throw new InternalServerErrorException('Не удалось удалить операцию');
    }
  }
}
