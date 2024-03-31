import { Inject, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { PrismaClient } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { DevicePushEvent } from 'src/push/domain/event/device-push.event';

export interface CalculateEvent {
  today: {
    count: number;
    sum: number;
    cancel_count: number;
  };
  month: {
    count: number;
    sum: number;
  };
}
export interface MenuRankingEvent {
  count: number;
  rank: number;
  menu_id: number;
  name: string;
}

export interface DashBoardEvent {
  market_id: number;
  cal_data: CalculateEvent;
  menu_ranking: MenuRankingEvent;
}

export interface JoinRoomAction {
  room_id: string;
}

export interface CallAction {
  market_id: number; // 마켓아이디
  group_id: number; // 고객이 앉아있는 테이블의 그룹 아이디
  group_name: string;
  target_group_id: number; // 고객이 호출하고 싶은 그룹의 아이디
  table_num: string; // 고객이 앉아있는 테이블의 번호
}

@WebSocketGateway({
  cors: { origin: '*' },
  transports: ['websocket'],
  namespace: /\/ws-.+/,
  pingInterval: 10000,
  pingTimeout: 5000,
  allowEIO3: true
})
export class EventGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  private logger = new Logger(EventGateway.name);

  constructor(
    private readonly eventBus: EventBus,
    @Inject('PRISMA_CLIENT')
    private prisma: PrismaClient
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit() {
    this.logger.log(`Socket Server Init Complete`);
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    client.emit('connect-message', `${client.id}`);
    this.logger.log(`${client.id}가 연결되었습니다`);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`${client.id}가 연결이 끊겼습니다`);
  }

  @SubscribeMessage('join-room')
  async joinRoomEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: JoinRoomAction
  ) {
    try {
      this.logger.log(`${client.nsp.name}-${data.room_id} 에 입장~`);
      // client.join(`${client.nsp.name}-${data.room_id}`);
      client.join(`${client.nsp.name}-${data.room_id}`);
      client.emit('join-room', `${client.nsp.name}-${data.room_id} 에 입장~`);
    } catch (error: any) {
      this.logger.error(error);
      client.emit('error-message-receive', { data: error.message });
    }
  }

  @SubscribeMessage('leave-room')
  async leaveRoomEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: JoinRoomAction
  ) {
    try {
      this.logger.log(`${data.room_id} 에 퇴장~`);
      client.leave(data.room_id);
      client.emit('leave-room', `${data.room_id} 에 퇴장~`);
    } catch (error: any) {
      this.logger.error(error);
      client.emit('error-message-receive', { data: error.message });
    }
  }

  @SubscribeMessage('call')
  async callEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CallAction
  ) {
    try {
      this.server.to(`${client.nsp.name}-employee`).emit('call', data);
      this.eventBus.publish(new DevicePushEvent(data));

      const target_group = await this.prisma.group.findFirst({
        where: {
          id: data.target_group_id
        }
      });
      if (!target_group) throw new CustomError(RESULT_CODE.NOT_FOUND_GROUP);
      data.group_name = target_group.name;

      this.server.to(`${client.nsp.name}-master`).emit('call', data);
    } catch (error: any) {
      this.logger.error(error);
    }
  }

  masterOrderSendEvent(data: any) {
    // 마스터에게 주문 정보 실시간 전송
    this.server
      .to(`/ws-${data.main_order.market_id}-master`)
      .emit('order-completed', data);
  }

  employeeOrderSendEvent(data: any) {
    // 점원에게 주문 정보 실시간 전송
    this.server
      .to(`/ws-${data.main_order.market_id}-employee`)
      .emit('order-completed', data);
  }

  customerOrderUpdateEvent(data: any) {
    // 소비자 주문 정보 실시간 전송
    if (data.guest_id) {
      this.server
        .to(`/ws-${data.market_id}-${data.guest_id}`)
        .emit('order-update-completed', data);
      return true;
    }

    this.server
      .to(`/ws-${data.market_id}-${data.user_id}`)
      .emit('order-update-completed', data);
  }

  masterOrderUpdateEvent(data: any) {
    // 마스터 주문 수정 정보 실시간 전송
    this.server
      .to(`/ws-${data.market_id}-master`)
      .emit('order-update-completed', data);
  }

  employeeOrderUpdateEvent(data: any) {
    // 점원 주문 정보 실시간 전송
    this.server
      .to(`/ws-${data.market_id}-employee`)
      .emit('order-update-completed', data);
  }

  masterDashBoardSendEvent(data: DashBoardEvent) {
    // 대쉬보드 관련 데이터 실시간 전송
    this.server.to(`/ws-${data.market_id}-master`).emit('board-receive', data);
  }
}
