import { ICommand } from '@nestjs/cqrs';

export class UploadLogoImageCommand implements ICommand {
  constructor(
    readonly filename: string,
    readonly buffer: Buffer,
    readonly group_id: number
  ) {}
}
