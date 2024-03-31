import { Inject, Module } from '@nestjs/common';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { InjectionToken } from 'src/setting/application/Injection-token';
import { SettingQuery } from 'src/setting/application/query/setting.query';
import isCurrentTimeInRange from 'src/utils/time-in-range';
import { SettingModule } from 'src/setting/setting.module';
import { OrderGroupPaymentQuery } from 'src/order/application/query/order-group-payment.query';
import { OrderGroupPaymentStatus } from 'src/order/infrastructure/entity/order-group-payment.entity';
import { OrderGroupPaymentQueryImplement } from 'src/order/infrastructure/query/order-group-payment.query.implement';

export interface OrderValidation {
  validation: (group_ids: number[]) => Promise<boolean>;
}

export class OrderValidationImplement implements OrderValidation {
  @Inject(InjectionToken.SETTING_QUERY)
  readonly settingQuery: SettingQuery;

  @Inject(InjectionToken.ORDER_GROUP_PAYMENT_QUERY)
  readonly orderGroupPaymentQuery: OrderGroupPaymentQuery;

  async validation(
    group_ids: number[],
  ): Promise<boolean> {
    const settings: any[] = await this.getMarketGroupSettings(group_ids);
    for (const setting of settings) {
      if(this.isInBreakTime(setting)){
        throw new CustomError(RESULT_CODE.BREAK_TIME);
      }
      if (!this.isInBusinessHours(setting)) {
        throw new CustomError(RESULT_CODE.NON_BUSINESS_HOURS);
      }
    }
    return true;
  }

  async menuValidation(gorup_id: number): Promise<boolean> {
    const setting: any = await this.getMarketSettingByGroupId(gorup_id);
    return this.isInBusinessHours(setting) && !this.isInBreakTime(setting);
  }

  private async getMarketGroupSettings(group_ids: number[]) {
    const settings = await Promise.all(
      group_ids.map(async (group_id) => {
        const setting = await this.settingQuery.findByGroupId(group_id);
        if (!setting) throw new CustomError(RESULT_CODE.NOT_FOUND_MARKET);
        return setting;
      })
    );
    return settings;
  }

  private async getMarketSettingByGroupId(gorup_id: number) {
    const setting = await this.settingQuery.findByGroupId(gorup_id);
    if (!setting) throw new CustomError(RESULT_CODE.NOT_FOUND_MARKET);
    return setting;
  }

  private isInBusinessHours(setting: {
    start_business_hours: string;
    end_business_hours: string;
    market: { country: string };
  }): boolean {
    const {
      start_business_hours,
      end_business_hours,
      market: { country }
    } = setting;
    if (start_business_hours && end_business_hours && start_business_hours !== '00:00:00' && end_business_hours !== '00:00:00') {
      return isCurrentTimeInRange(
        start_business_hours,
        end_business_hours,
        country
      );
    }
    return true;
  }

  private isInBreakTime(setting: {
    start_break_time: string;
    end_break_time: string;
    market: { country: string };
  }): boolean {
    const {
      start_break_time,
      end_break_time,
      market: { country }
    } = setting;
    if (start_break_time && end_break_time && start_break_time !== '00:00:00' && end_break_time !== '00:00:00') {
      return isCurrentTimeInRange(start_break_time, end_break_time, country);
    }
    return false;
  }
}

export const ORDER_VALIDATOR = 'ORDER_VALIDATOR';

@Module({
  imports: [SettingModule],
  providers: [
    {
      provide: ORDER_VALIDATOR,
      useClass: OrderValidationImplement
    },
    {
      provide: InjectionToken.ORDER_GROUP_PAYMENT_QUERY,
      useClass: OrderGroupPaymentQueryImplement
    }
  ],
  exports: [ORDER_VALIDATOR]
})
export class ValidationModule {}
