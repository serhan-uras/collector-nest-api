import { IsNumber, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDistributorDto {
  @IsUUID()
  @ApiProperty({
    example: '8288fb26-0007-4731-9de9-1fd873217550',
    description: 'Distributor UUID',
  })
  readonly id: string;

  @IsString()
  @ApiProperty({
    example: 'The IWSR Drinks Plc',
    description: 'Distributor name',
  })
  readonly name: string;

  @IsNumber()
  @ApiProperty({
    example: 209,
    description: 'Country id',
  })
  readonly countryId: number;
}
