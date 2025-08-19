import { Module } from '@nestjs/common';
import { RfidController } from './rfid.controller';
import { RfidService } from './rfid.service';

@Module({
  controllers: [RfidController],
  providers: [RfidService],
  exports: [RfidService] // So StudentService can use it
})
export class RfidModule {}
