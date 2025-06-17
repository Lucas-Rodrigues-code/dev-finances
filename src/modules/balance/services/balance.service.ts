import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../../transactions/repositories/transaction.repository';
import { Transaction } from '../../transactions/entities/transaction.entity';

export interface BalanceByCategory {
  categoryId: string;
  categoryName: string;
  total: number;
  transactions: Transaction[];
}

export interface BalanceByPeriod {
  period: string;
  income: number;
  expense: number;
  total: number;
  transactions: Transaction[];
}

@Injectable()
export class BalanceService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async getTotalBalance(userId: string): Promise<number> {
    const transactions = await this.transactionRepository.findAll();
    const userTransactions = transactions.filter((t) => t.userId === userId);

    return userTransactions.reduce((acc, transaction) => {
      return transaction.type === 'income'
        ? acc + transaction.amount
        : acc - transaction.amount;
    }, 0);
  }

  async getBalanceByPeriod(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<BalanceByPeriod[]> {
    const transactions = await this.transactionRepository.findAll();
    const userTransactions = transactions.filter(
      (t) => t.userId === userId && t.date >= startDate && t.date <= endDate,
    );

    const periodMap = new Map<string, BalanceByPeriod>();

    userTransactions.forEach((transaction) => {
      const period = transaction.date.toISOString().slice(0, 7); // YYYY-MM format

      if (!periodMap.has(period)) {
        periodMap.set(period, {
          period,
          income: 0,
          expense: 0,
          total: 0,
          transactions: [],
        });
      }

      const periodBalance = periodMap.get(period)!;

      if (transaction.type === 'income') {
        periodBalance.income += transaction.amount;
      } else {
        periodBalance.expense += transaction.amount;
      }

      periodBalance.total = periodBalance.income - periodBalance.expense;
      periodBalance.transactions.push(transaction);
    });

    return Array.from(periodMap.values()).sort((a, b) =>
      a.period.localeCompare(b.period),
    );
  }

  async getBalanceByCategory(userId: string): Promise<BalanceByCategory[]> {
    const transactions = await this.transactionRepository.findAll();
    const userTransactions = transactions.filter((t) => t.userId === userId);

    const categoryMap = new Map<string, BalanceByCategory>();

    userTransactions.forEach((transaction) => {
      if (!categoryMap.has(transaction.categoryId)) {
        categoryMap.set(transaction.categoryId, {
          categoryId: transaction.categoryId,
          categoryName: transaction.category?.name || 'Sem categoria',
          total: 0,
          transactions: [],
        });
      }

      const categoryBalance = categoryMap.get(transaction.categoryId)!;

      categoryBalance.total +=
        transaction.type === 'income'
          ? transaction.amount
          : -transaction.amount;

      categoryBalance.transactions.push(transaction);
    });

    return Array.from(categoryMap.values()).sort((a, b) => b.total - a.total);
  }
}
