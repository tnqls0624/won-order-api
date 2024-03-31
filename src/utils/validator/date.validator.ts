import { registerDecorator } from 'class-validator';
import dayjs from 'dayjs';

export function IsValidDate() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsLadderValue',
      target: object.constructor,
      propertyName: propertyName,
      validator: {
        validate(value: string | number) {
          return dayjs(value).isValid();
        }
      }
    });
  };
}
