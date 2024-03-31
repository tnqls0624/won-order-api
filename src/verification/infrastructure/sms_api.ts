import { Logger } from '@nestjs/common';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

export default class SMSApi {
  client = new SNSClient({ region: 'ap-northeast-1' });

  private logger = new Logger(SMSApi.name);

  public requestAuth = async (phone: string, code: string) => {
    try {
      const params = {
        Message: `[Order-Planet]\nVerification Code : ${code}`,
        PhoneNumber: phone
      };
      const command = new PublishCommand(params);
      const sms_output = await this.client.send(command);
      if (!sms_output) throw new CustomError(RESULT_CODE.PHONE_NUMBER_ERROR);
      return true;
    } catch (err) {
      this.logger.error(err);
      new CustomError(RESULT_CODE.UNKNOWN_ERROR);
    }
  };
}
