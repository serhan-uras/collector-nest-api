import { Expose } from 'class-transformer';

export class OwnerDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
