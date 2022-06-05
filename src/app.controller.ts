import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('App')
@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'say hello' })
  @ApiResponse({ status: 200, description: 'Return hello.' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
