import { IEvent } from '@nestjs/cqrs';
import { UpdateEmployeeDto } from 'src/auth/interface/dto/req/update-employee.dto';
import { CqrsEvent } from 'src/event/cqrs-events';

export class UpdateEmployeeEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly id: number,
    readonly body: UpdateEmployeeDto
  ) {
    super(UpdateEmployeeEvent.name);
  }
}
