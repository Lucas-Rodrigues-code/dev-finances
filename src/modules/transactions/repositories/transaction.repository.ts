import { Injectable } from '@nestjs/common';
import { Transaction } from '../entities/transaction.entity';
import { CreateTransactionDto, UpdateTransactionDto } from '../dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const transaction = this.transactionRepository.create(createTransactionDto);
    return await this.transactionRepository.save(transaction);
  }

  async findAll(): Promise<Transaction[]> {
    return await this.transactionRepository.find();
  }

  async findById(id: string): Promise<Transaction | null> {
    return await this.transactionRepository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction | null> {
    await this.transactionRepository.update(id, updateTransactionDto);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.transactionRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
