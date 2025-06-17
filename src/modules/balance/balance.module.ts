import { Module } from '@nestjs/common';
import { TransactionModule } from '../transactions/transaction.module';
import { BalanceController } from './controllers/balance.controller';
import { BalanceService } from './services/balance.service';

@Module({
  imports: [TransactionModule],
  controllers: [BalanceController],
  providers: [BalanceService],
  exports: [BalanceService],
})
export class BalanceModule {}
