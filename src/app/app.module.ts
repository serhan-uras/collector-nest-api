import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DistributorsModule } from '../distributors/distributor.module';
import { Distributor } from '../distributors/distributor.entity';
import { OwnersModule } from '../owners/owner.module';
import { LoggerMiddleware } from '../middlewares/logger.middleware';
import { AuthorizationMiddleware } from '../middlewares/authorization.middleware';
import { CountryEntity } from '../countries/country.entity';
import { CountriesModule } from '../countries/countries.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'collector-nest-api.sqlite',
      entities: [Distributor, CountryEntity],
      synchronize: true,
    }),
    DistributorsModule,
    OwnersModule,
    CountriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL })
      .apply(AuthorizationMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
