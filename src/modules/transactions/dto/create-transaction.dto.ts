import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  Min,
} from 'class-validator';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export class CreateTransactionDto {
  @IsNotEmpty({ message: 'UserId é obrigatório' })
  @IsString({ message: 'UserId deve ser uma string' })
  userId: string;

  @IsNotEmpty({ message: 'Title é obrigatório' })
  @IsString({ message: 'Title deve ser uma string' })
  title: string;

  @IsOptional()
  @IsString({ message: 'Description deve ser uma string' })
  description?: string;

  @IsNotEmpty({ message: 'Amount é obrigatório' })
  @IsNumber({}, { message: 'Amount deve ser um número' })
  @Min(0, { message: 'Amount deve ser maior ou igual a zero' })
  amount: number;

  @IsNotEmpty({ message: 'Type é obrigatório' })
  @IsEnum(TransactionType, { message: 'Type deve ser income ou expense' })
  type: TransactionType;

  @IsNotEmpty({ message: 'CategoryId é obrigatório' })
  @IsString({ message: 'CategoryId deve ser uma string' })
  categoryId: string;

  @IsOptional()
  date?: Date;
}
