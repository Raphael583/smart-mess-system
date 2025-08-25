import { Controller, Post, Get, Delete, Body } from '@nestjs/common';
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
    this.rfidService.setUID(rawUID);
    return { message: 'RFID UID received and stored temporarily.' };
  }

  @Get('get')
  getRFID() {
    const uid = this.rfidService.getUID();
    if (!uid) {
      return { message: 'No active UID (expired or not scanned yet)' };
    }
    return { uid };
  }

  @Delete('clear')
  clearRFID() {
    this.rfidService.clearUID();
    return { message: 'RFID UID cleared manually.' };
  }
}
