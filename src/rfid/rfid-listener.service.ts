import { Injectable, OnModuleInit } from '@nestjs/common';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import axios from 'axios';

@Injectable()
export class RfidListenerService implements OnModuleInit {
  private lastUID: string | null = null;
  private timeout: NodeJS.Timeout | null = null;

  async onModuleInit() {
    const port = new SerialPort({
      path: 'COM4',       // 👈 Change if your ESP32 is on another COM port
      baudRate: 115200,
      autoOpen: false,
    });

    const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

    port.open((err) => {
      if (err) {
        return console.error(`❌ Error opening port: ${err.message}`);
      }
      console.log('📡 Serial connection opened. Listening for RFID scans...');
    });

    parser.on('data', async (data: string) => {
      const uid = data.replace(/^UID:\s*/i, '').trim();
      if (!uid || uid === this.lastUID) return;

      this.lastUID = uid;

      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        console.log('⌛ UID expired.');
        this.lastUID = null;
        this.timeout = null;
      }, 30 * 1000); // 2 minutes

      console.log(`📥 UID received: ${uid}`);

      try {
        // Instead of axios, directly call your RfidService
        await axios.post('http://localhost:3000/rfid/scan', { uid });
        console.log('✅ Sent to backend');
      } catch (err) {
        console.error('❌ Error sending to backend:', err.message);
      }
    });
  }
}
