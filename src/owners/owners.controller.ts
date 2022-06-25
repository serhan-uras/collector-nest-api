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
import { UpdateOwnerDto, CreateOwnerDto, OwnerDto } from './dtos/';
import { OwnersService } from './owners.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { GetUser } from '../auth/user.decorator';
import { Authorize } from '../interceptors/authorize.interceptor';

@ApiBearerAuth()
@ApiTags('Owners')
@Authorize()
@Controller('api/owners')
export class OwnersController {
  constructor(private ownersService: OwnersService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get all owner' })
  @ApiResponse({ status: 200, description: 'Return all owner.' })
  @Serialize(OwnerDto)
  async findAll() {
    return await this.ownersService.findAll();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get owner owner' })
  @ApiResponse({ status: 200, description: 'Return owner.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Serialize(OwnerDto)
  async find(@Param('id', ParseUUIDPipe) id: string) {
    const owner = await this.ownersService.findOne(id);
    if (!owner) {
      throw new NotFoundException('owner not found');
    }
    return owner;
  }

  @ApiOperation({ summary: 'Create owner' })
  @ApiResponse({
    status: 201,
    description: 'The owner has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Serialize(OwnerDto)
  @Post('/')
  createUser(@GetUser() user, @Body() body: CreateOwnerDto) {
    this.ownersService.create(user, { ...body });
  }

  @ApiOperation({ summary: 'Update owner' })
  @ApiResponse({
    status: 201,
    description: 'The owner has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Serialize(OwnerDto)
  @Patch('/:id')
  async update(
    @GetUser() user,
    @Param('id') id: string,
    @Body() body: UpdateOwnerDto,
  ) {
    return await this.ownersService.update(user, id, body);
  }

  @ApiOperation({ summary: 'Delete owner' })
  @ApiResponse({
    status: 201,
    description: 'The owner has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Serialize(OwnerDto)
  @Delete('/:id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.ownersService.remove(id);
  }
}
