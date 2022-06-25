import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { Repository } from 'typeorm';
import { CountryEntity } from './country.entity';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(CountryEntity) private repo: Repository<CountryEntity>,
  ) {}

  create(user: User, country: Partial<CountryEntity>) {
    const createdCountry = this.repo.create({
      ...country,
      updatedBy: user.id,
    });

    return this.repo.save(createdCountry);
  }

  async findOne(id: number) {
    const country = await this.repo.findOne(id);
    if (!country) {
      throw new NotFoundException('not found');
    }

    return country;
  }

  findAll() {
    return this.repo.find();
  }

  async update(user: User, id: number, attrs: Partial<CountryEntity>) {
    const country = await this.findOne(id);

    return this.repo.save({
      ...country,
      ...attrs,
      updatedBy: user.id,
    });
  }

  async remove(id: number) {
    const country = await this.findOne(id);

    return this.repo.remove(country);
  }
}
