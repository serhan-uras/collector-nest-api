import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '../auth/role.entity';
import { GetUser } from '../auth/user.decorator';
import { Authorize } from '../interceptors/authorize.interceptor';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CountriesService } from './countries.service';
import { CountryDto } from './dtos/country.dto';
import { CreateCountryDto } from './dtos/create-country.dto';
import { UpdateCountryDto } from './dtos/update-country.dto';

@ApiBearerAuth()
@ApiTags('Countries')
@Serialize(CountryDto)
@Controller('api/countries')
export class CountriesController {
  constructor(private countriesService: CountriesService) {}

  @ApiOperation({ summary: 'Get all countries' })
  @ApiResponse({ status: 200, description: 'Return all countries.' })
  @Get('/')
  async findAll() {
    return this.countriesService.findAll();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get country' })
  @ApiResponse({ status: 200, description: 'Return country feed.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Authorize()
  async find(@Param('id', ParseIntPipe) id: number) {
    return this.countriesService.findOne(id);
  }

  @ApiOperation({ summary: 'Create country' })
  @ApiResponse({
    status: 201,
    description: 'The country has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Authorize([Role.Admin])
  @Post('/')
  create(@GetUser() user, @Body() body: CreateCountryDto) {
    return this.countriesService.create(user, { ...body });
  }

  @ApiOperation({ summary: 'Update country' })
  @ApiResponse({
    status: 201,
    description: 'The country has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Authorize([Role.Admin])
  @Patch('/:id')
  async update(
    @GetUser() user,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCountryDto,
  ) {
    return await this.countriesService.update(user, id, body);
  }

  @ApiOperation({ summary: 'Delete country' })
  @ApiResponse({
    status: 201,
    description: 'The country has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Authorize([Role.Admin])
  @Delete('/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.countriesService.remove(id);
  }
}
