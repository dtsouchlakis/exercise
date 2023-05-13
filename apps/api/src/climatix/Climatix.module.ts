import { Module } from '@nestjs/common';
import { ClimatixService } from './Climatix.service';
import { ClimatixController } from './Climatix.controller';

@Module({
  controllers: [ClimatixController],
  providers: [ClimatixService],
  exports: [ClimatixService],
})
export class ClimatixModule {}
