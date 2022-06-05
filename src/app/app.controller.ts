import { Controller, Get, Res } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiTags,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiBearerAuth()
@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'say hello' })
  @ApiResponse({ status: 200, description: 'Return hello.' })
  @Get('sayHello')
  sayHello(): string {
    return this.appService.getHello();
  }

  @Get()
  @ApiExcludeEndpoint()
  redirectToSwaggerDoc(@Res() resp): string {
    return resp.redirect('/docs');
  }
}
