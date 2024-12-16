import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  ValidationPipe,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { OwnershipGuard } from './guard/category.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  create(@Body() createCategoryDto: CreateCategoryDto, @Req() req) {
    return this.categoryService.create(createCategoryDto, +req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  findAll(@Req() req) {
    return this.categoryService.findAll(+req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, OwnershipGuard)
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, OwnershipGuard)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
