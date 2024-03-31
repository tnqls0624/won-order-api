import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import dayjs from 'dayjs';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { MenuState, MenuStatus } from '../infrastructure/entity/menu.entity';
import { CreateMenuOptionCategoryType } from '../interface/dto/create-menu.dto';
import { Menu, MenuImplement, MenuProperties } from './menu';

type CreateMenuOptions = Readonly<{
  menu_category_id: number;
  status: MenuStatus;
  state: MenuState;
  name: string;
  content: string;
  amount: number;
  index: number;
  is_active: boolean;
  menu_option_category: CreateMenuOptionCategoryType[];
  image_ids: number[];
}>;

export class MenuFactory {
  constructor(
    @Inject(EventPublisher)
    private readonly eventPublisher: EventPublisher
  ) {}

  create(options: CreateMenuOptions): Menu {
    // 메뉴 이름은 필수입니다.
    if (!options.name) {
      throw new CustomError(RESULT_CODE.MENU_NAME_REQUEIRE);
    }

    // 가격은 0보다 커야 합니다.
    if (options.amount <= 0) {
      throw new CustomError(RESULT_CODE.MENU_AMOUNT_IS_NOT_ZERO);
    }

    return this.eventPublisher.mergeObjectContext(
      new MenuImplement({
        ...options,
        create_at: dayjs().toDate(),
        update_at: dayjs().toDate(),
        remove_at: null
      })
    );
  }

  reconstitute(properties: MenuProperties): Menu {
    return this.eventPublisher.mergeObjectContext(
      new MenuImplement(properties)
    );
  }
}
