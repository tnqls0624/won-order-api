import { Inject } from '@nestjs/common';
import { InjectionToken } from 'src/auth/application/Injection-token';
import { AdminRepository } from 'src/auth/domain/admin.repository';
import { AdminDto } from 'src/auth/interface/dto/model/admin.dto';
import { LoginType } from 'src/types/login.type';

export class GroupDomainService {
  constructor(
    @Inject(InjectionToken.ADMIN_REPOSITORY)
    private readonly adminRepository: AdminRepository
  ) {}

  async validateAdmin(type: LoginType, market_id: number, admin: AdminDto) {
    return this.adminRepository.validateAdmin(type, market_id, admin.admin_id);
  }
}
