import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistributorsController } from './distributors.controller';
import { DistributorsService } from './distributors.service';
import { Distributor } from './distributor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Distributor])],
  controllers: [DistributorsController],
  providers: [DistributorsService],
})
export class DistributorsModule {}
