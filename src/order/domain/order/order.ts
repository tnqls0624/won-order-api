import { AggregateRoot } from '@nestjs/cqrs';
import { OrderMenuOption } from '../main-order/main-order';
import axios from 'axios';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';
import NodeRSA from 'node-rsa';

export type OrderEssentialProperties = Readonly<
  Required<{
    main_order_id: number;
    order_num: string;
    total: number;
    create_at: Date;
    update_at: Date;
    remove_at: Date | null;
  }>
>;

export type OrderOptionalProperties = Readonly<
  Partial<{
    delivery_addr?: string;
  }>
>;

export type OrderProperties = OrderEssentialProperties &
  Partial<OrderOptionalProperties>;

export interface Order {
  abaRefund: () => void;
}

export class OrderImplement extends AggregateRoot implements Order {
  private readonly id: number;
  private main_order_id: number;
  private order_num: string;
  private total: number;
  private order_menu_option: OrderMenuOption[];
  private delivery_addr?: string;
  private remove_at: Date | null;
  private create_at: Date;
  private update_at: Date;
  constructor(properties: OrderProperties) {
    super();
    // this.validateProperties(properties);
    this.autoCommit = true;
    Object.assign(this, properties);
  }

  async abaRefund() {
    const request_time = dayjs().format('YYYYMMDDHHmmss');
    const merchant_id = process.env.ABA_MERCHANT_ID as string;
    const tran_id = this.order_num;
    const aba_api_key = process.env.ABA_PUBLIC_KEY as string;
    const aba_public_key = fs.readFileSync(
      path.join(__dirname, '../asset/ec417062-rsa.public'),
      'utf8'
    );
    const merchant_auth_data = {
      mc_id: merchant_id,
      tran_id,
      refund_amount: this.total.toString()
    };
    const key = new NodeRSA(aba_public_key);

    // 공개키로 데이터 암호화
    const merchant_auth = key.encrypt(merchant_auth_data, 'hex');
    const hash_data = request_time + merchant_id + merchant_auth;

    // const hash_data = {
    //   request_time,
    //   merchant_id,
    //   merchant_auth
    // }

    const hash = crypto
      .createHmac('sha512', aba_api_key)
      .update(JSON.stringify(hash_data))
      .digest('base64');
    // 암호화된 데이터를 16진수 문자열로 변환

    await axios.post(
      `${process.env.ABA_URL}/api/merchant-portal/merchant-access/online-transaction/refund`,
      {
        request_time,
        merchant_id,
        merchant_auth,
        hash
      }
    );

    // console.log(result);
    // this.apply(new RefundOrderEvent(this.id))
  }
}
