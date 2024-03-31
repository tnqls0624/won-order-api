import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../src/auth/domain/user.repository';
import { InjectionToken } from '../src/auth/application/Injection-token';

@Injectable()
export class Reflector implements OnModuleInit {
  private static jwtService: JwtService;
  private static userRepository: UserRepository;

  constructor(
    private jwtService: JwtService,
    @Inject(InjectionToken.USER_REPOSITORY)
    private readonly userRepository: UserRepository
  ) {}

  onModuleInit() {
    Reflector.jwtService = this.jwtService;
    Reflector.userRepository = this.userRepository;
  }

  static getJwtService() {
    return Reflector.jwtService;
  }

  static getUserRepository() {
    return Reflector.userRepository;
  }
}
