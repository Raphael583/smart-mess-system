

import { Controller, Post, Body } from '@nestjs/common';
import { RfidService } from './rfid.service';

@Controller('rfid')
export class RfidController {
  constructor(private readonly rfidService: RfidService) {}

  @Post('scan')
  scanRFID(@Body() body: { uid: string }) {
    const rawUID = body.uid;
    if (!rawUID) {
      return { message: 'UID is missing' };
    }

    this.rfidService.setUID(rawUID); // sets and cleans it internally
    return { message: 'RFID UID received and stored temporarily.' };
  }
}
