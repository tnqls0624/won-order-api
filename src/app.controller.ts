import { Controller, Get } from '@nestjs/common';
@Controller()
export class AppController {
  @Get()
  healthCheck(): string {
    return 'Won Order Server Is Running!';
  }
}
