import { IsNotEmpty, IsUUID, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class BalancePeriodDto {
  @IsNotEmpty({ message: 'UserId é obrigatório' })
  @IsUUID('4', { message: 'UserId deve ser um UUID válido' })
  userId: string;

  @IsNotEmpty({ message: 'Data inicial é obrigatória' })
  @IsDateString({}, { message: 'Data inicial deve estar no formato ISO' })
  @Transform(({ value }) => new Date(value))
  startDate: Date;

  @IsNotEmpty({ message: 'Data final é obrigatória' })
  @IsDateString({}, { message: 'Data final deve estar no formato ISO' })
  @Transform(({ value }) => new Date(value))
  endDate: Date;
}
