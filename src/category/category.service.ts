import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, id: number) {
    const { title } = createCategoryDto;
    const checkCategory = await this.categoryRepository.findOne({
      where: {
        title,
        user: { id },
      },
    });

    if (checkCategory) {
      throw new ConflictException('Категория с таким названием уже существует');
    }

    const category = {
      title: createCategoryDto.title,
      user: { id },
    };

    try {
      return await this.categoryRepository.save(category);
    } catch (error) {
      console.error('Ошибка при создании категории', error);
      throw new InternalServerErrorException('Не удалось создать категорию');
    }
  }

  async findAll(id: number) {
    try {
      const category = await this.categoryRepository.find({
        where: {
          user: { id },
        },
      });

      return category;
    } catch (error) {
      console.error('Ошибка при загрузке категории', error);
      throw new InternalServerErrorException('Не удалось загрузить категории');
    }
  }

  async findOne(id: number) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
        relations: {
          user: true,
        },
      });

      if (!category) {
        throw new NotFoundException('Категория не найдена');
      }

      return category;
    } catch (error) {
      console.error('Ошибка при загрузке категории', error);
      throw new InternalServerErrorException('Не удалось загрузить категорию');
    }
  }

  async remove(id: number) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
      });

      if (!category) throw new NotFoundException('Категория не найдена');

      return await this.categoryRepository.delete(id);
    } catch (error) {
      console.error('Ошибка при удалении категории', error);
      throw new InternalServerErrorException('Не удалось удалить категорию');
    }
  }
}
