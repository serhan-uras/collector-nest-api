import { Injectable, NotFoundException } from '@nestjs/common';
import { Owner } from './owner.entity';
import { User } from 'src/user/user.entity';
import RedshiftClient from 'src/redshift.client';

@Injectable()
export class OwnersService {
  async create(user: User, owner: Partial<Owner>) {
    const result = await RedshiftClient.executeQuery(`
      INSERT INTO owners(id, name, createdBy, createdDate)
      VALUES('${owner.id}', '${owner.name}', '${
      user.id
    }', '${new Date().toString()}')
    `);

    return result;
  }

  async findOne(id: string) {
    const queryResult = await RedshiftClient.executeQuery(`
      SELECT * FROM owners WHERE id = '${id}'
    `);

    console.log({
      queryResult,
    });

    return queryResult.length > 0 ? queryResult[0] : null;
  }

  async findAll() {
    return await RedshiftClient.executeQuery('SELECT * FROM owners');
  }

  async update(user: User, id: string, attrs: Partial<Owner>) {
    const owner = await this.findOne(id);
    if (!owner) {
      throw new NotFoundException('owner not found');
    }
    await RedshiftClient.executeQuery(`
      UPDATE owners SET
       name = '${attrs.name ?? owner.name}'
      WHERE id = '${id}'
    `);

    return {
      ...owner,
      ...attrs,
    };
  }

  async remove(id: string) {
    const owner = await this.findOne(id);
    if (!owner) {
      throw new NotFoundException('owner not found');
    }
    await RedshiftClient.executeQuery(`DELETE FROM owners WHERE id = '${id}'`);

    return owner;
  }
}
