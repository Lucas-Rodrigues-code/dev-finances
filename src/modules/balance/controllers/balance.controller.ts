import { Controller, Get, Query } from '@nestjs/common';
import { BalanceService } from '../services/balance.service';
import {
  BalanceByCategory,
  BalanceByPeriod,
} from '../services/balance.service';
import { BalancePeriodDto } from '../dto/balance-period.dto';
import { BalanceUserDto } from '../dto/balance-user.dto';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get('total')
  async getTotalBalance(
    @Query() query: BalanceUserDto,
  ): Promise<{ total: number }> {
    const total = await this.balanceService.getTotalBalance(query.userId);
    return { total };
  }

  @Get('by-period')
  async getBalanceByPeriod(
    @Query() query: BalancePeriodDto,
  ): Promise<BalanceByPeriod[]> {
    return this.balanceService.getBalanceByPeriod(
      query.userId,
      query.startDate,
      query.endDate,
    );
  }

  @Get('by-category')
  async getBalanceByCategory(
    @Query() query: BalanceUserDto,
  ): Promise<BalanceByCategory[]> {
    return this.balanceService.getBalanceByCategory(query.userId);
  }
}
