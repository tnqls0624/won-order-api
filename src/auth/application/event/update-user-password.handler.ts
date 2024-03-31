// import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
// import { UpdateUserPasswordEvent } from 'src/auth/domain/event/update-user-password.event';
//
// @EventsHandler(UpdateUserPasswordEvent)
// export class UpdateUserPasswordHandler
//   implements IEventHandler<UpdateUserPasswordEvent>
// {
//   constructor(
//     @Inject(InjectionToken.USER_REPOSITORY)
//     private readonly userRepository: UserRepository
//   ) {}
//
//   async handle(event: UpdateUserPasswordEvent) {
//     const { id, password } = event;
//     await this.userRepository.updatePassword(id, password);
//   }
// }
