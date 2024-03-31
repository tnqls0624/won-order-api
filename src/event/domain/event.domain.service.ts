import { Inject, Injectable } from '@nestjs/common';
import { AdminQuery } from 'src/auth/application/query/admin.query';
import { UserQuery } from 'src/auth/application/query/user.query';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { AdminType } from 'src/types/login.type';
import { InjectionToken } from '../application/injection.token';

@Injectable()
export class EventDomainService {
  constructor(
    @Inject(InjectionToken.ADMIN_QUERY)
    private readonly adminQuery: AdminQuery,
    @Inject(InjectionToken.USER_QUERY)
    private readonly userQuery: UserQuery
  ) {}

  async getUserPhone(message: any): Promise<string> {
    const user = await this.userQuery.findById(message.user_id);
    if (!user) throw new CustomError(RESULT_CODE.NOT_FOUND_USER);
    return user.phone;
  }

  async getUniqueEmployeeIds(
    message: any
  ): Promise<{ id: number; language_id: number }[]> {
    const unique_group_ids = this.getUniqueGroupIds(message.menu_list);
    return this.getAllEmployeeIds(unique_group_ids, message.market_id);
  }

  private getUniqueGroupIds(menu_list: { group_id: number }[]): number[] {
    return [...new Set(menu_list.map((menu) => Number(menu.group_id)))];
  }

  async getAllEmployeeIds(
    unique_group_ids: number[],
    market_id: number
  ): Promise<{ id: number; language_id: number }[]> {
    let employees_info: { id: number; language_id: number }[] = [];
    for (const group_id of unique_group_ids) {
      const infos = await this.adminQuery.findAllByType(
        market_id,
        group_id,
        AdminType.EMPLOYEE
      );
      employees_info = [...employees_info, ...infos];
    }
    return employees_info;
  }
}
