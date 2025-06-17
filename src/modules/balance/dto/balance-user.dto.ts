import { IsNotEmpty, IsUUID } from 'class-validator';

export class BalanceUserDto {
  @IsNotEmpty({ message: 'UserId é obrigatório' })
  @IsUUID('4', { message: 'UserId deve ser um UUID válido' })
  userId: string;
} 