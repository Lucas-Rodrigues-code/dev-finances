import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from '../repositories/transaction.repository';
import { NotFoundException } from '@nestjs/common';
import { Transaction } from '../entities/transaction.entity';
import { TransactionType } from '../dto/create-transaction.dto';

describe('TransactionService', () => {
  let service: TransactionService;
  let repository: TransactionRepository;

  const mockTransactionRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: TransactionRepository,
          useValue: mockTransactionRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    repository = module.get<TransactionRepository>(TransactionRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar uma nova transação', async () => {
      const createTransactionDto = {
        userId: 'user-id',
        title: 'Salário',
        amount: 5000,
        type: TransactionType.INCOME,
        categoryId: 'category-id',
        date: new Date(),
        description: 'Salário mensal',
      };

      const expectedTransaction = new Transaction({
        id: 'transaction-id',
        ...createTransactionDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockTransactionRepository.create.mockResolvedValue(expectedTransaction);

      const result = await service.create(createTransactionDto);

      expect(repository.create).toHaveBeenCalledWith(createTransactionDto);
      expect(result).toEqual(expectedTransaction);
    });
  });

  describe('findAll', () => {
    it('deve retornar um array de transações', async () => {
      const expectedTransactions = [
        new Transaction({
          id: 'transaction-1',
          userId: 'user-id',
          title: 'Transação 1',
          amount: 100,
          type: TransactionType.INCOME,
          categoryId: 'category-id',
          date: new Date(),
        }),
        new Transaction({
          id: 'transaction-2',
          userId: 'user-id',
          title: 'Transação 2',
          amount: 200,
          type: TransactionType.EXPENSE,
          categoryId: 'category-id',
          date: new Date(),
        }),
      ];

      mockTransactionRepository.findAll.mockResolvedValue(expectedTransactions);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedTransactions);
    });
  });

  describe('findById', () => {
    it('deve retornar uma transação quando encontrada', async () => {
      const transactionId = 'transaction-id';
      const expectedTransaction = new Transaction({
        id: transactionId,
        userId: 'user-id',
        title: 'Transação',
        amount: 100,
        type: TransactionType.INCOME,
        categoryId: 'category-id',
        date: new Date(),
      });

      mockTransactionRepository.findById.mockResolvedValue(expectedTransaction);

      const result = await service.findById(transactionId);

      expect(repository.findById).toHaveBeenCalledWith(transactionId);
      expect(result).toEqual(expectedTransaction);
    });

    it('deve lançar NotFoundException quando a transação não for encontrada', async () => {
      const transactionId = 'non-existent-id';

      mockTransactionRepository.findById.mockResolvedValue(null);

      await expect(service.findById(transactionId)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findById).toHaveBeenCalledWith(transactionId);
    });
  });

  describe('update', () => {
    it('deve atualizar uma transação existente', async () => {
      const transactionId = 'transaction-id';
      const updateTransactionDto = {
        title: 'Título Atualizado',
        amount: 150,
      };

      const updatedTransaction = new Transaction({
        id: transactionId,
        userId: 'user-id',
        title: updateTransactionDto.title,
        amount: updateTransactionDto.amount,
        type: TransactionType.INCOME,
        categoryId: 'category-id',
        date: new Date(),
      });

      mockTransactionRepository.update.mockResolvedValue(updatedTransaction);

      const result = await service.update(transactionId, updateTransactionDto);

      expect(repository.update).toHaveBeenCalledWith(
        transactionId,
        updateTransactionDto,
      );
      expect(result).toEqual(updatedTransaction);
    });

    it('deve lançar NotFoundException ao tentar atualizar uma transação inexistente', async () => {
      const transactionId = 'non-existent-id';
      const updateTransactionDto = {
        title: 'Título Atualizado',
      };

      mockTransactionRepository.update.mockResolvedValue(null);

      await expect(
        service.update(transactionId, updateTransactionDto),
      ).rejects.toThrow(NotFoundException);
      expect(repository.update).toHaveBeenCalledWith(
        transactionId,
        updateTransactionDto,
      );
    });
  });

  describe('delete', () => {
    it('deve deletar uma transação existente', async () => {
      const transactionId = 'transaction-id';

      mockTransactionRepository.delete.mockResolvedValue(true);

      await service.delete(transactionId);

      expect(repository.delete).toHaveBeenCalledWith(transactionId);
    });

    it('deve lançar NotFoundException ao tentar deletar uma transação inexistente', async () => {
      const transactionId = 'non-existent-id';

      mockTransactionRepository.delete.mockResolvedValue(false);

      await expect(service.delete(transactionId)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.delete).toHaveBeenCalledWith(transactionId);
    });
  });
});
