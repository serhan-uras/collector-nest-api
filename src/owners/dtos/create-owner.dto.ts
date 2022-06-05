import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOwnerDto {
  @IsUUID()
  @ApiProperty({
    example: '90a94ec2-e45f-11ec-8fea-0242ac120002',
    description: 'Owner UUID',
  })
  readonly id: string;

  @IsString()
  @ApiProperty({
    example: 'Serhan Uras',
    description: 'Owner name',
  })
  readonly name: string;
}
