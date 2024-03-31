import serviceAccount from '../../../asset/i-order-31220-firebase-adminsdk-1ptm6-9e1115aac8.json';
import * as firebase from 'firebase-admin';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../application/Injection-token';
import { PushRepository } from './push.repository';
import CustomError from 'src/common/error/custom-error';

const firebase_admin = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount as object)
});

export class PushDomainService {
  constructor(
    @Inject(InjectionToken.PUSH_REPOSITORY)
    private readonly pushRepository: PushRepository
  ) {}

  async sendMessage(
    users: number | number[],
    data: { title: string; body: string; data?: any; ring: string }
  ) {
    try {
      const user_ids = Array.isArray(users) ? users : [users];
      const token_entitie = await this.pushRepository.findAll(user_ids);
      const tokens = token_entitie.filter((token) => token !== '');

      if (!tokens.length) return;
      await firebase
        .app(firebase_admin.name)
        .messaging()
        .sendEachForMulticast({
          tokens,
          notification: {
            title: data.title,
            body: data.body
          },
          android: {
            notification: {
              sound: 'call.mp3'
            }
          },
          apns: {
            payload: {
              aps: {
                sound: 'call.mp3'
              }
            }
          },
          data: { data: JSON.stringify(data) }
        })
        .catch(console.warn);
      return tokens.length;
    } catch (error) {
      console.log(error);
      throw new CustomError(error);
    }
  }
}
