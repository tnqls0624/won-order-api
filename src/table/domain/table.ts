import { AggregateRoot } from '@nestjs/cqrs';
import { GroupEntity } from 'src/group/infrastructure/entity/group.entity';
import { DeleteTableEvent } from './event/delete-table.event';
import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';

export type TableEssentialProperties = Readonly<
  Required<{
    code: string;
    market_id: number;
    group_id: number;
    table_num: string;
  }>
>;

export type TableOptionalProperties = Readonly<
  Partial<{
    create_at: Date;
    update_at: Date;
    remove_at: Date | null;
  }>
>;

export type TableProperties = TableEssentialProperties &
  Required<TableOptionalProperties>;

export interface Table {
  delete: () => void;
  createQRCode: (market_id: number) => Promise<string>;
}

export class TableImplement extends AggregateRoot implements Table {
  private readonly id: number;
  private readonly market_id: number;
  private group_id: number;
  private table_num: string;
  private code: string;
  private group: GroupEntity;
  private create_at: Date;
  private update_at: Date;
  private remove_at: Date | null;

  constructor(properties: TableProperties) {
    super();
    this.autoCommit = true;
    Object.assign(this, properties);
  }
  async createQRCode(market_id: number): Promise<string> {
    const qr_code = {
      id: this.id,
      type: 'BASIC'
    };
    const qr_secret = CryptoJS.AES.encrypt(JSON.stringify(qr_code), 'soobeen')
      .toString()
      .replace(/\//g, '_');
    const mobile_url = `${process.env.WEB}/market/${market_id}?code=${qr_secret}`;
    return mobile_url;
  }

  delete(): void {
    this.update_at = dayjs().toDate();
    this.remove_at = dayjs().toDate();
    this.apply(new DeleteTableEvent(this.id));
  }
}
