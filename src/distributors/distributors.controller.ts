import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  NotFoundException,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  UpdateDistributorDto,
  CreateDistributorDto,
  DistributorDto,
} from './dtos/';
import { DistributorsService } from './distributors.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { GetUser } from 'src/auth/user.decorator';
import { Authorize } from 'src/interceptors/authorize.interceptor';
import { Role } from 'src/auth/rote.entity';

@ApiBearerAuth()
@ApiTags('Distributors')
@Controller('distributors')
export class DistributorsController {
  constructor(private distributorService: DistributorsService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get all distributor' })
  @ApiResponse({ status: 200, description: 'Return all distributor.' })
  @Serialize(DistributorDto)
  @Authorize([Role.ResearchDirectors])
  async findAll() {
    return await this.distributorService.findAll();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get distributor feed' })
  @ApiResponse({ status: 200, description: 'Return distributor feed.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Serialize(DistributorDto)
  @Authorize([Role.CentralTeam])
  async find(@Param('id', ParseUUIDPipe) id: string) {
    const distributor = await this.distributorService.findOne(id);
    if (!distributor) {
      throw new NotFoundException('distributor not found');
    }
    return distributor;
  }

  @ApiOperation({ summary: 'Create distributor' })
  @ApiResponse({
    status: 201,
    description: 'The distributor has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Serialize(DistributorDto)
  @Authorize([Role.ResearchDirectors])
  @Post('/')
  createUser(@GetUser() user, @Body() body: CreateDistributorDto) {
    this.distributorService.create(user, { ...body });
  }

  @ApiOperation({ summary: 'Update distributor' })
  @ApiResponse({
    status: 201,
    description: 'The distributor has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Serialize(DistributorDto)
  @Authorize()
  @Patch('/:id')
  async update(
    @GetUser() user,
    @Param('id') id: string,
    @Body() body: UpdateDistributorDto,
  ) {
    return await this.distributorService.update(user, id, body);
  }

  @ApiOperation({ summary: 'Delete distributor' })
  @ApiResponse({
    status: 201,
    description: 'The distributor has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Serialize(DistributorDto)
  @Authorize()
  @Delete('/:id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.distributorService.remove(id);
  }
}
