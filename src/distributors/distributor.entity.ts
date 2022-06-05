import { AbstractEntity } from 'src/abstract.entity';
import { AfterInsert, AfterRemove, AfterUpdate, Entity, Column } from 'typeorm';

@Entity('distributors')
export class Distributor extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  countryId: number;

  @AfterInsert()
  logInsert() {
    console.log('Inserted Distributor with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated Distributor with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed Distributor with id', this.id);
  }
}
