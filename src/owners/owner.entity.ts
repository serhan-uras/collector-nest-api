import { AbstractEntity } from '../utils/abstract.entity';
import { AfterInsert, AfterRemove, AfterUpdate, Entity, Column } from 'typeorm';

@Entity('owners')
export class Owner extends AbstractEntity {
  @Column()
  name: string;

  @AfterInsert()
  logInsert() {
    console.log('Inserted Owner with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated Owner with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed Owner with id', this.id);
  }
}
