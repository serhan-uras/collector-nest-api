import { IsString } from 'class-validator';

export class UpdateCountryDto {
  @IsString()
  readonly name: string;
}
