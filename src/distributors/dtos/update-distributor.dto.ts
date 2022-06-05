import { IsNumber, IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDistributorDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'The IWSR Drinks Plc',
    description: 'Distributor name',
  })
  name: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 209,
    description: 'Country id',
  })
  countryId: number;
}
