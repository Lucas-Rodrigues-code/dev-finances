import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { CreateTransactionDto, UpdateTransactionDto } from '../dto';
import { Transaction } from '../entities/transaction.entity';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateTransactionDto): Promise<Transaction> {
    return this.transactionService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<Transaction[]> {
    return this.transactionService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Transaction> {
    return this.transactionService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.transactionService.delete(id);
  }
}
