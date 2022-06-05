import { Expose } from 'class-transformer';

export class DistributorDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  countryId: number;
}
