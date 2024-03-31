import { AggregateRoot } from '@nestjs/cqrs';
import { DeleteUserEvent } from './event/delete-user.event';
import { UpdateUserPasswordEvent } from './event/update-user-password.event';
import { UpdateUserEvent } from './event/update-user.event';
import dayjs from 'dayjs';
import { UpdateAuthDto } from '../interface/dto/req/update-auth.dto';
import { RecoveryUserEvent } from './event/recovery-user.event';
import { Provider } from '../../types/login.type';

export type UserEssentialProperties = Readonly<
  Required<{
    token: string;
    nickname: string;
    provider: Provider;
    create_at: Date;
    update_at: Date;
  }>
>;

export type UserOptionalProperties = Readonly<
  Partial<{
    remove_at: Date | null;
    phone: string | null;
    password: string | null;
    address: string | null;
  }>
>;

export type UserProperties = Required<UserEssentialProperties> &
  UserOptionalProperties;

export interface User {
  withdrawal: () => void;
  updatePassword: (password: string) => void;
  update: (body: UpdateAuthDto) => void;
  recovery: () => void;
  changePassword: (password: string) => void;
}

export class UserImplement extends AggregateRoot implements User {
  private readonly id: number;
  private token: string;
  private provider: Provider;
  private phone: string | null;
  private password: string | null;
  private nickname: string;
  private address: string | null;
  private remove_at: Date | null;
  private create_at: Date;
  private update_at: Date;

  constructor(properties: UserProperties) {
    super();
    this.autoCommit = true;
    Object.assign(this, properties);
  }
  recovery() {
    this.apply(new RecoveryUserEvent(this.id));
  }

  updatePassword(password: string) {
    this.apply(new UpdateUserPasswordEvent(this.id, password));
  }
  update(body: UpdateAuthDto) {
    this.update_at = dayjs().toDate();
    this.apply(new UpdateUserEvent(this.id, body));
  }
  changePassword(password: string): void {
    this.apply(new UpdateUserPasswordEvent(this.id, password));
  }
  withdrawal() {
    this.apply(new DeleteUserEvent(this.id));
  }
}
