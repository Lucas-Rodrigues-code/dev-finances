import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { TransactionType } from './create-transaction.dto';

export class UpdateTransactionDto {
  @IsOptional()
  @IsString({ message: 'Title deve ser uma string' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Description deve ser uma string' })
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Amount deve ser um número' })
  amount?: number;

  @IsOptional()
  @IsEnum(TransactionType, { message: 'Type deve ser income ou expense' })
  type?: TransactionType;

  @IsOptional()
  @IsString({ message: 'CategoryId deve ser uma string' })
  categoryId?: string;

  @IsOptional()
  date?: Date;
}
