import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateFinanceLogicDto } from './dto/create-finance-logic.dto';
import { Between, Repository } from 'typeorm';
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

  async total(id: number) {
    try {
      const finance = await this.financeRepository.find({
        where: {
          user: { id },
        },
      });

      const total = finance.reduce((acc, obj) => acc + obj.amount, 0);

      return total;
    } catch (error) {
      console.error('ошибка получения общей суммы', error);
      throw new InternalServerErrorException('Не удалось загрузть данные');
    }
  }

  async findLastWeek(id: number) {
    const today = new Date();

    const sevenDay = new Date();
    sevenDay.setDate(today.getDate() - 7);

    try {
      const finance = await this.financeRepository.find({
        where: {
          user: { id },
          createdAt: Between(sevenDay, today),
        },
        order: {
          createdAt: 'DESC',
        },
      });

      return finance;
    } catch (error) {
      console.error('Ошибка при загрузке операций за последние 7 дней', error);
      throw new InternalServerErrorException(
        'Не удалось загрузить операции за последние 7 дней',
      );
    }
  }

  async findIncomeLastMonth(id: number) {
    const today = new Date();

    const month = new Date();
    month.setDate(today.getDate() - 30);

    try {
      const finance = await this.financeRepository.find({
        where: {
          user: { id },
          createdAt: Between(month, today),
          type: 'Поступление',
        },
      });

      const value = finance.reduce((acc, fin) => acc + fin.amount, 0);

      return { value };
    } catch (error) {
      console.error('Ошибка при загрузке операций за последние 30 дней', error);
      throw new InternalServerErrorException(
        'Не удалось загрузить операции за последние 30 дней',
      );
    }
  }

  async findExpensesLastMonth(id: number) {
    const today = new Date();

    const month = new Date();
    month.setDate(today.getDate() - 30);

    try {
      const finance = await this.financeRepository.find({
        where: {
          user: { id },
          createdAt: Between(month, today),
          type: 'Расход',
        },
      });

      const value = finance.reduce((acc, fin) => acc + fin.amount, 0);

      return { value };
    } catch (error) {
      console.error('Ошибка при загрузке операций за последние 30 дней', error);
      throw new InternalServerErrorException(
        'Не удалось загрузить операции за последние 30 дней',
      );
    }
  }

  async findAll(id: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const take = limit;

    try {
      const [finance, total] = await this.financeRepository.findAndCount({
        where: {
          user: { id },
        },
        relations: {
          category: true,
        },
        skip,
        take,
      });

      const totalPage = Math.ceil(total / take);

      return { finance, total, totalPage, currentPage: page };
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
