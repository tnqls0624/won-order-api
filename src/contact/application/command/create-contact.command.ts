import { ICommand } from '@nestjs/cqrs';
import { CreateContactDto } from '../../interface/dto/create-contact.dto';

export class CreateContactCommand implements ICommand {
  constructor(readonly body: CreateContactDto) {}
}
