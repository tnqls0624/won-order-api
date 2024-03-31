import { IQuery } from '@nestjs/cqrs';

export class FindMainOrderQuery implements IQuery {
  constructor(
    readonly id: number,
    readonly order_menu_status: string,
    readonly language_code: string
  ) {}
}
