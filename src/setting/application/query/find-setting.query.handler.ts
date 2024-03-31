import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../Injection-token';
import { FindSettingQuery } from './find-setting.query';
import { SettingQuery } from './setting.query';

@QueryHandler(FindSettingQuery)
export class FindSettingQueryHandler
  implements IQueryHandler<FindSettingQuery>
{
  constructor(
    @Inject(InjectionToken.SETTING_QUERY)
    readonly settingQuery: SettingQuery
  ) {}

  async execute(query: FindSettingQuery) {
    const { id } = query;

    // const req_time = '20230115004300';
    // const merchant_id = 'ec417062';
    // const tran_id = 'MO-1704960511970';
    // const firstname = 'firstname';
    // const lastname = 'lastname';
    // const email = 'ema_il@textdomain.com';
    // const phone = '0965965965';
    // const amount = '10';
    // const type = 'purcahse';
    // const currency = 'KHR';
    // const continue_success_url = 'www.staticmerchanturl.com/Success';
    // const return_deeplink = '';
    // const custom_fields = '{}';
    // const return_param = '';
    // const payment_option = 'cards';
    // // const payment_option = 'cards';
    //
    // const base_str = req_time + merchant_id + tran_id +  amount + payment_option;
    // const hash = crypto.createHmac('sha512','aa9f4fac0ea585bd908a13a5ba8364ea0285eb63').update(base_str).digest('base64');
    // const frm = new FormData();
    // frm.append('req_time',req_time);
    // frm.append('merchant_id',merchant_id);
    // frm.append('tran_id',tran_id);
    // // frm.append('firstname',firstname);
    // // frm.append('lastname',lastname);
    // // frm.append('email',email);
    // // frm.append('phone',phone);
    // frm.append('amount',amount);
    // // frm.append('type',type);
    // frm.append('payment_option',payment_option);
    // // frm.append('items','');
    // // frm.append('currency',currency);
    // // frm.append('continue_success_url',continue_success_url);
    // // frm.append('return_deeplink',return_deeplink);
    // // frm.append('custom_fields',custom_fields);
    // // frm.append('return_param',return_param);
    // frm.append('hash',hash);
    //
    // await axios.post('https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase',frm,{
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   }
    // }).then((response) => {
    //   // 응답 처리
    //   console.log(response);
    // })
    // .catch((error) => {
    //   // 예외 처리
    //   console.log(error);
    // })
    return this.settingQuery.findById(id);
  }
}
