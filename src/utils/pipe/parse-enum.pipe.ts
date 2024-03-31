import {
  BadRequestException,
  PipeTransform,
  Injectable,
  ArgumentMetadata
} from '@nestjs/common';

@Injectable()
export class ParseEnumPipe implements PipeTransform {
  constructor(private readonly enumType: any) {}

  transform(value: string, metadata: ArgumentMetadata) {
    if (!this.enumType[value]) {
      throw new BadRequestException(
        `Invalid parameter. '${value}' is not in the ${metadata.data} enum.`
      );
    }
    return this.enumType[value];
  }
}
