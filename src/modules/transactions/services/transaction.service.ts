import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionRepository } from '../repositories/transaction.repository';
import { CreateTransactionDto, UpdateTransactionDto } from '../dto';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async create(
    CreateTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionRepository.create(CreateTransactionDto);
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.findAll();
  }

  async findById(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findById(id);

    if (!transaction) {
      throw new NotFoundException('Transação não encontrado');
    }

    return transaction;
  }

  async update(
    id: string,
    UpdateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.update(
      id,
      UpdateTransactionDto,
    );

    if (!transaction) {
      throw new NotFoundException('Transação não encontrado');
    }

    return transaction;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.transactionRepository.delete(id);

    if (!deleted) {
      throw new NotFoundException('Transação não encontrado');
    }
  }
}
