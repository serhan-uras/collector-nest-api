import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Mock } from 'ts-mockery';
import {
  createConnection,
  getConnection,
  getRepository,
  Repository,
} from 'typeorm';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { CountryEntity } from './country.entity';

describe('CountriesController', () => {
  const testConnectionName = 'testConnection';
  let controller: CountriesController;
  let service: CountriesService;
  let repository: Repository<CountryEntity>;
  const updatedBy = 'user01';
  const countryEntities: CountryEntity[] = [
    Mock.of<CountryEntity>({
      id: 1,
      name: 'United Kingdom',
      updatedBy,
    }),
    Mock.of<CountryEntity>({
      id: 2,
      name: 'Turkiye',
      updatedBy,
    }),
    Mock.of<CountryEntity>({
      id: 3,
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

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountriesController],
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

    controller = new CountriesController(service);

    return connection;
  });

  afterEach(async () => {
    await getConnection(testConnectionName).close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('CountriesController', () => {
    it('should execute service.findAll for findAll', async () => {
      expect.assertions(2);
      jest
        .spyOn(service, 'findAll')
        .mockImplementation(async () => countryEntities);

      const countries = await controller.findAll();

      expect(service.findAll).toBeCalled();
      expect(countries).toBe(countryEntities);
    });

    it('should execute service.findOne item for find', async () => {
      expect.assertions(2);
      jest
        .spyOn(service, 'findOne')
        .mockImplementation(async () => countryEntities[1]);

      const country = await controller.find(2);

      expect(service.findOne).toBeCalled();
      expect(country).toBe(countryEntities[1]);
    });

    it('should execute service.create for create', async () => {
      expect.assertions(2);
      jest
        .spyOn(service, 'create')
        .mockImplementation(async () => countryEntities[0]);

      const country = await controller.create(user, countryEntities[0]);

      expect(service.create).toBeCalledWith(user, countryEntities[0]);
      expect(country).toBe(countryEntities[0]);
    });

    it('should execute service.update for update', async () => {
      expect.assertions(2);
      jest
        .spyOn(service, 'update')
        .mockImplementation(async () => countryEntities[0]);

      const country = await controller.update(user, 1, countryEntities[0]);

      expect(service.update).toBeCalledWith(user, 1, countryEntities[0]);
      expect(country).toBe(countryEntities[0]);
    });

    it('should execute service.remove for remove', async () => {
      expect.assertions(2);
      jest
        .spyOn(service, 'remove')
        .mockImplementation(async () => countryEntities[0]);

      const country = await controller.remove(1);

      expect(service.remove).toBeCalledWith(1);
      expect(country).toBe(countryEntities[0]);
    });
  });
});
