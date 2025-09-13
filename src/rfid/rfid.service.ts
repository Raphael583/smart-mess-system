import { Injectable } from '@nestjs/common';

@Injectable()
export class RfidService {
  private uid: string | null = null;
  private timeoutHandle: NodeJS.Timeout | null = null;

  
  setUID(rawUID: string): void {
    // Remove 'UID: ' prefix if present
    const cleanedUID = rawUID.replace(/^UID:\s*/i, '').trim();
    this.uid = cleanedUID;

    // Clear previous timeout
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }

    // Expire UID after 2 minutes
    this.timeoutHandle = setTimeout(() => {
      this.uid = null;
      this.timeoutHandle = null;
    }, 10 * 1000); // 10 seconds
  }

  getUID(): string | null {
    return this.uid;
  }

  clearUID(): void {
    this.uid = null;
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = null;
    }
  }
}
