import { IsNumber, IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOwnerDto {
  @IsString()
  @ApiProperty({
    example: 'Serhan Uras',
    description: 'Owner name',
  })
  readonly name: string;
}
