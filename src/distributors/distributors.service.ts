import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Distributor } from './distributor.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class DistributorsService {
  constructor(
    @InjectRepository(Distributor) private repo: Repository<Distributor>,
  ) {}

  create(user: User, distributor: Partial<Distributor>) {
    const createdDistributor = this.repo.create({
      ...distributor,
      createdBy: user.id,
    });

    return this.repo.save(createdDistributor);
  }

  findOne(id: string) {
    return this.repo.findOne(id);
  }

  findAll() {
    return this.repo.find();
  }

  async update(user: User, id: string, attrs: Partial<Distributor>) {
    const distributor = await this.findOne(id);
    if (!distributor) {
      throw new NotFoundException('distributor not found');
    }
    return this.repo.save({
      ...distributor,
      ...attrs,
      updatedBy: user.id,
    });
  }

  async remove(id: string) {
    const distributor = await this.findOne(id);
    if (!distributor) {
      throw new NotFoundException('distributor not found');
    }
    return this.repo.remove(distributor);
  }
}
