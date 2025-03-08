import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Test the API' })
  @ApiResponse({ status: 200, description: 'hello, world! - API is working!' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
