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

  @Get()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req) {
    return this.financeLogicService.findAll(+req.user.id);
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
