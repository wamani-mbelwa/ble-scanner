// src/usecases/ReadCharacteristic.ts
import { BLEGateway } from '@app/ports/BLEGateway';

export class ReadCharacteristic {
  constructor(private ble: BLEGateway) {}

  async read(deviceId: string, serviceUUID: string, characteristicUUID: string): Promise<string> {
    // Simple timeout for robustness
    const timeout = (ms: number) => new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms));
    return (await Promise.race([this.ble.readCharacteristic(deviceId, serviceUUID, characteristicUUID), timeout(8000)])) as string;
  }
}
