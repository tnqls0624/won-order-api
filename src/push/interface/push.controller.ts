import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard';
import { User } from 'src/common/decorators/user.decorator';
import { ResponseDto } from 'src/common/response/response.dto';
import { RegistDeviceCommand } from '../application/command/regist-device.command';
import { RegistDeviceDto } from './dto/regist-device.dto';
import axios from 'axios';
import CustomError from 'src/common/error/custom-error';
import { DevicePushEvent } from '../domain/event/device-push.event';
import { RemoveDeviceCommand } from '../application/command/remove-device.command';
import { AdminDto } from '../../auth/interface/dto/model/admin.dto';

@ApiTags('PUSH')
@Controller('push')
export class PushController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '디바이스 등록 (admin)' })
  @Post('/regist')
  async createDevice(@User() admin: AdminDto, @Body() body: RegistDeviceDto) {
    return this.commandBus.execute(new RegistDeviceCommand(admin, body));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '디바이스 제거 (admin)' })
  @Delete('/remove')
  async deleteDevice(@User() admin: AdminDto) {
    return this.commandBus.execute(new RemoveDeviceCommand(admin));
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '영수증 인쇄 테스트' })
  @Post('/test/print')
  async printTest() {
    try {
      await axios.post('https://810e-119-65-103-62.ngrok-free.app/order', {
        market_id: 1,
        market_name: 'Itech Restorant',
        table_id: 5,
        table_group_id: 1,
        date: '2023-10-20T03:23:51.229Z',
        non_member_id: 'lnduwzdq3wgxlgdupt',
        total: 30,
        state: 'WAIT',
        type: 'HALL',
        menu_list: [
          {
            group_id: 1,
            menu_id: 1,
            name: 'KimchiSoup',
            option_list: [
              {
                option_id: 2,
                name: 'middleFlavor',
                amount: 0
              },
              {
                option_id: 2,
                name: 'middleFlavor',
                amount: 10.5
              },
              {
                option_id: 2,
                name: 'middleFlavor',
                amount: 10
              }
            ],
            num: 2,
            amount: 10,
            sum: 20
          },
          {
            group_id: 1,
            menu_id: 1,
            name: 'TunaSoup',
            option_list: [
              {
                option_id: 2,
                name: 'middleFlavor',
                amount: 0
              }
            ],
            num: 3,
            amount: 10,
            sum: 30
          },
          {
            group_id: 2,
            menu_id: 2,
            name: 'Americano',
            option_list: [
              {
                option_id: 2,
                name: 'wwwwwwwwww',
                amount: 0
              }
            ],
            num: 1,
            amount: 10,
            sum: 10
          }
        ],
        request: '',
        __v: 0
      });
    } catch (error) {
      console.log(error);
      throw new CustomError(error);
    }

    // const printer = new ThermalPrinter({
    //   type: PrinterTypes.EPSON,
    //   interface: 'tcp://192.168.0.250',
    //   characterSet: CharacterSet.KOREA
    // });
    // const isConnected = await printer.isPrinterConnected();
    // const order = {
    //   _id: 'c6092cfb-e9e2-4acb-80ef-32447e69ff64',
    //   msg_id: '5174cdbb-b7c8-4b48-b3d5-bb5b235b2d2f',
    //   market_id: 1,
    //   market_name: '아이테크 레스토랑',
    //   table_id: 5,
    //   table_group_id: 1,
    //   date: '2023-10-20T03:23:51.229Z',
    //   non_member_id: 'lnduwzdq3wgxlgdupt',
    //   total: 30,
    //   state: 'WAIT',
    //   type: 'HALL',
    //   menu_list: [
    //     {
    //       group_id: 1,
    //       menu_id: 1,
    //       name: '김치찌개',
    //       option_list: [
    //         {
    //           option_id: 2,
    //           name: '중간맛',
    //           amount: 0
    //         }
    //       ],
    //       num: 5,
    //       amount: 10,
    //       sum: 50
    //     },
    //     {
    //       group_id: 1,
    //       menu_id: 1,
    //       name: '참치찌개',
    //       option_list: [
    //         {
    //           option_id: 2,
    //           name: '중간맛',
    //           amount: 0
    //         }
    //       ],
    //       num: 2,
    //       amount: 10,
    //       sum: 20
    //     },
    //     {
    //       group_id: 2,
    //       menu_id: 2,
    //       name: '아메리카노',
    //       option_list: [
    //         {
    //           option_id: 2,
    //           name: 'ㅋㅋㅋㅋ',
    //           amount: 0
    //         }
    //       ],
    //       num: 3,
    //       amount: 10,
    //       sum: 30
    //     }
    //   ],
    //   request: '',
    //   __v: 0
    // };
    // if (!isConnected) {
    //   throw new Error('Printer is not connected');
    // }
    // const groups = order.menu_list.reduce((acc, menu) => {
    //   if (!acc[menu.group_id]) {
    //     acc[menu.group_id] = {
    //       total: 0,
    //       items: []
    //     };
    //   }
    //   acc[menu.group_id].total += menu.sum;
    //   acc[menu.group_id].items.push(menu);
    //   return acc;
    // }, {});
    // for (const [groupId, group] of Object.entries(groups)) {
    //   printer.alignCenter();
    //   printer.setTextDoubleHeight();
    //   printer.println('주문앱 영수증');
    //   printer.setTextNormal();
    //   printer.println(`매장명: ${order.market_name}`);
    //   printer.println(`테이블 번호: ${order.table_id}`);
    //   printer.println(`주문 날짜: ${order.date}`);
    //   printer.println(`Group ID: ${groupId}`);
    //   printer.newLine();
    //   group.items.forEach((item) => {
    //     printer.println(`메뉴명: ${item.name}`);
    //     printer.println(`수량: ${item.num}`);
    //     printer.println(`가격: ${item.sum}`);
    //     printer.println('요청사항:');
    //     item.option_list.forEach((option) => {
    //       printer.println(` - ${option.name}`);
    //     });
    //     printer.println('--------------------------');
    //   });
    //   printer.println(`그룹 ${groupId} 합계: ${group.total}`);
    //   printer.newLine();
    //   printer.println('감사합니다!');
    //   printer.cut();
    // }
    // try {
    //   printer.execute({ waitForResponse: false });
    //   return true;
    // } catch (error) {
    //   console.error(`Error while printing for group ${groupId}:`, error);
    //   throw error;
    // }
    // await this.receiptGenerator.printReceipt();
    // this.eventBus.publish(
    //   new DevicePushEvent({
    //     _id: 'c6092cfb-e9e2-4acb-80ef-32447e69ff64',
    //     msg_id: '5174cdbb-b7c8-4b48-b3d5-bb5b235b2d2f',
    //     market_id: 1,
    //     market_name: '아이테크 레스토랑',
    //     table_id: 5,
    //     table_group_id: 1,
    //     date: '2023-10-20T03:23:51.229Z',
    //     non_member_id: 'lnduwzdq3wgxlgdupt',
    //     total: 30,
    //     state: 'WAIT',
    //     type: 'HALL',
    //     menu_list: [
    //       {
    //         group_id: 1,
    //         menu_id: 1,
    //         name: '김치찌개',
    //         option_list: [
    //           {
    //             option_id: 2,
    //             name: '중간맛',
    //             amount: 0
    //           }
    //         ],
    //         num: 1,
    //         amount: 10,
    //         sum: 10
    //       },
    //       {
    //         group_id: 1,
    //         menu_id: 1,
    //         name: '참치찌개',
    //         option_list: [
    //           {
    //             option_id: 2,
    //             name: '중간맛',
    //             amount: 0
    //           }
    //         ],
    //         num: 1,
    //         amount: 10,
    //         sum: 10
    //       },
    //       {
    //         group_id: 2,
    //         menu_id: 2,
    //         name: '아메리카노',
    //         option_list: [
    //           {
    //             option_id: 2,
    //             name: 'ㅋㅋㅋㅋ',
    //             amount: 0
    //           }
    //         ],
    //         num: 1,
    //         amount: 10,
    //         sum: 10
    //       }
    //     ],
    //     request: '',
    //     __v: 0
    //   })
    // );
    // return this.eventGateway.masterOrderSendEvent({ market_id: 1 });
    // const client = new SNSClient({ region: 'ap-northeast-1' });
    // const params = {
    //   Message: '안녕하세요' /* required */,
    //   PhoneNumber: '8201022529668'
    // };
    // const command = new PublishCommand(params);
    // client.send(command);
    // return this.pushDomainService.sendMessage(2, {
    //   title: '서성',
    //   body: '바보',
    // });
    // const command = new RegistDeviceCommand(admin, body);
    // return this.commandBus.execute(command);
  }

  @ApiOkResponse({
    type: ResponseDto,
    description: '성공'
  })
  @ApiOperation({ summary: '호출 테스트' })
  @Post('/test/call')
  async test() {
    try {
      this.eventBus.publish(
        new DevicePushEvent({
          market_id: 1,
          group_id: 1,
          target_group_id: 1,
          table_num: '1'
        })
      );
    } catch (error) {
      console.log(error);
      throw new CustomError(error);
    }
  }
}
