import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  healthCheck(): string {
    try {
      return 'Hello world!';
    } catch (error) {
      throw error;
    }
  }
}
