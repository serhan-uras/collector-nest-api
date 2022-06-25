import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { Mock, Mockery } from 'ts-mockery';
import {
  createConnection,
  getConnection,
  getRepository,
  Repository,
} from 'typeorm';

import { CountriesService } from './countries.service';
import { CountryEntity } from './country.entity';

describe('CountriesService', () => {
  let service: CountriesService;
  let repository: Repository<CountryEntity>;
  const updatedBy = 'user01';

  const testConnectionName = 'testConnection';
  const countryEntities: CountryEntity[] = [
    Mockery.of<CountryEntity>({
      name: 'United Kingdom',
      updatedBy,
    }),
    Mockery.of<CountryEntity>({
      name: 'Turkiye',
      updatedBy,
    }),
    Mockery.of<CountryEntity>({
      name: 'Spain',
      updatedBy,
    }),
  ];

  const user = Mock.of<User>({
    id: updatedBy,
  });

  beforeEach(async () => {
    const connection = await createConnection({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [CountryEntity],
      synchronize: true,
      logging: false,
      name: testConnectionName,
    });

    await Test.createTestingModule({
      providers: [
        CountriesService,
        {
          provide: getRepositoryToken(CountryEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    repository = getRepository(CountryEntity, testConnectionName);

    service = new CountriesService(repository);

    await getConnection(testConnectionName)
      .createQueryBuilder()
      .insert()
      .into(CountryEntity)
      .values(countryEntities)
      .execute();

    return connection;
  });

  afterEach(async () => {
    await getConnection(testConnectionName).close();
  });

  it('should be defined', () => {
    expect.assertions(1);

    expect(service).toBeDefined();
  });

  it('should return all records for findAll', async () => {
    expect.assertions(2);

    const countries = await service.findAll();
    expect(countries.length).toBe(3);
    expect(countries[0]).toEqual(expect.objectContaining(countryEntities[0]));
  });

  it('should throw not found for findOne when record not found with provided id', async () => {
    expect.assertions(1);

    const findOneCountryPromise = service.findOne(5);

    expect(findOneCountryPromise).rejects.toThrow(NotFoundException);
  });

  it('should return selected item for findOne', async () => {
    expect.assertions(1);

    const country = await service.findOne(2);

    expect(country).toEqual(expect.objectContaining(countryEntities[1]));
  });

  it('should return inserted country for create', async () => {
    expect.assertions(2);

    const insertedCountry = await service.create(
      user,
      Mockery.of<CountryEntity>({
        name: 'Germany',
        updatedBy,
      }),
    );

    const countries = await service.findAll();

    expect(countries[3]).toEqual(
      expect.objectContaining({ name: 'Germany', updatedBy }),
    );
    expect(insertedCountry).toEqual(
      expect.objectContaining({ name: 'Germany', updatedBy }),
    );
  });

  it('should throw not found for update when record not found with provided id', async () => {
    expect.assertions(1);

    const updatedCountryPromise = service.update(
      user,
      5,
      Mockery.of<CountryEntity>({
        name: 'France',
        updatedBy,
      }),
    );

    expect(updatedCountryPromise).rejects.toThrow(NotFoundException);
  });

  it('should return updated country for update', async () => {
    expect.assertions(2);

    const updatedCountry = await service.update(
      user,
      3,
      Mockery.of<CountryEntity>({
        name: 'France',
        updatedBy,
      }),
    );

    const countries = await service.findAll();

    expect(countries[2]).toEqual(
      expect.objectContaining({ name: 'France', updatedBy }),
    );
    expect(updatedCountry).toEqual(
      expect.objectContaining({ name: 'France', updatedBy }),
    );
  });

  it('should throw not found for remove when record not found with provided id', async () => {
    expect.assertions(1);

    const updatedCountryPromise = service.remove(5);

    expect(updatedCountryPromise).rejects.toThrow(NotFoundException);
  });

  it('should return removed country for remove', async () => {
    expect.assertions(2);

    const removedCountry = await service.remove(3);
    const countries = await service.findAll();

    expect(countries.length).toBe(2);
    expect(removedCountry).toEqual(
      expect.objectContaining({ name: countryEntities[2].name }),
    );
  });
});
