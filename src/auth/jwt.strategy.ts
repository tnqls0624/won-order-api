import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import CustomError from 'src/common/error/custom-error';
import { RESULT_CODE } from 'src/constant';
import { LoginType } from 'src/types/login.type';
import { UserRepository } from './domain/user.repository';
import { InjectionToken } from './application/Injection-token';
import { AdminRepository } from './domain/admin.repository';
import { GroupRepository } from 'src/group/domain/group.repository';

export type Payload = {
  type: LoginType;
  id: number;
  market_id: number;
  signname: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_ACCESS_TOKEN_SECRET || 'temporarySecretForTesting'
    });
  }

  @Inject(InjectionToken.USER_REPOSITORY)
  private readonly userRepository: UserRepository;

  @Inject(InjectionToken.ADMIN_REPOSITORY)
  private readonly adminRepository: AdminRepository;

  @Inject(InjectionToken.GROUP_REPOSITORY)
  private readonly groupRepository: GroupRepository;

  async validate(payload: Payload) {
    const { market_id, signname, type } = payload;
    if (type === LoginType.USER) {
      const user = await this.userRepository.validateUser(signname);
      return user;
    }
    const admin = await this.adminRepository.validateAdmin(
      type,
      market_id ? market_id : undefined,
      signname
    );

    if (type === LoginType.SUPER) {
      return admin;
    }
    const market = await this.adminRepository.findMarket(market_id);
    if (!admin) throw new CustomError(RESULT_CODE.NOT_FOUND_ADMIN);
    const groups = await this.groupRepository.findAllWithLanguageId(
      admin.market_id,
      admin.language_id
    );
    if (!groups) throw new CustomError(RESULT_CODE.NOT_FOUND_GROUP);
    const admin_group_map: Map<number, boolean> = new Map();
    admin.admin_group.forEach(
      (v: { group: { id: number }; selected: boolean }) => {
        admin_group_map.set(v.group.id, v.selected ?? false);
      }
    );
    const admin_group = groups.map((group: any) => ({
      group: {
        id: group.id,
        name: group.name,
        content: group.content,
        group_tl: group.group_tl
      },
      selected: admin_group_map.get(group.id) ?? false
    }));
    return {
      ...admin,
      currency_code: market.currency.code,
      admin_group
    };
  }
}
