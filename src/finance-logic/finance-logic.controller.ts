import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  ValidationPipe,
  UsePipes,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FinanceLogicService } from './finance-logic.service';
import { CreateFinanceLogicDto } from './dto/create-finance-logic.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('finance')
export class FinanceLogicController {
  constructor(private readonly financeLogicService: FinanceLogicService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  create(@Body() createFinanceLogicDto: CreateFinanceLogicDto, @Req() req) {
    return this.financeLogicService.create(createFinanceLogicDto, +req.user.id);
  }

  @Get('total')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  total(@Req() req) {
    return this.financeLogicService.total(+req.user.id);
  }

  @Get('last-week')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  findSeven(@Req() req) {
    return this.financeLogicService.findLastWeek(+req.user.id);
  }

  @Get('income-month')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  findIncomeLastMonth(@Req() req) {
    return this.financeLogicService.findIncomeLastMonth(+req.user.id);
  }

  @Get('expenses-month')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  findExpensesLastMonth(@Req() req) {
    return this.financeLogicService.findExpensesLastMonth(+req.user.id);
  }

  @Get()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  findAll(
    @Req() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.financeLogicService.findAll(+req.user.id, +page, +limit);
  }

  @Get(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.financeLogicService.findOne(+id);
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.financeLogicService.remove(+id);
  }
}
