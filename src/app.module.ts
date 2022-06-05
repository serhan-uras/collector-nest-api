import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DistributorsModule } from './distributors/distributor.module';
import { Distributor } from './distributors/distributor.entity';
import { OwnersModule } from './owners/owner.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'collector-nest-api.sqlite',
      entities: [Distributor],
      synchronize: true,
    }),
    DistributorsModule,
    OwnersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
