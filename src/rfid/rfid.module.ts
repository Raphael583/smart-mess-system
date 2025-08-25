import { Module } from '@nestjs/common';
import { RfidController } from './rfid.controller';
import { RfidService } from './rfid.service';
import { RfidListenerService } from './rfid-listener.service';

@Module({
  controllers: [RfidController],
  providers: [RfidService, RfidListenerService],
  exports: [RfidService] // So StudentService can use it
})
export class RfidModule {}
