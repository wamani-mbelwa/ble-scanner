// src/usecases/ConnectDevice.ts
import { BLEGateway } from '@app/ports/BLEGateway';
import { GattService } from '@app/core/entities';

export class ConnectDevice {
  constructor(private ble: BLEGateway) {}

  async connectAndDiscover(deviceId: string): Promise<GattService[]> {
    await this.ble.connect(deviceId);
    try {
      const services = await this.ble.discoverServices(deviceId);
      return services;
    } finally {
      // Keep connection for UI; the screen can disconnect on unmount.
    }
  }

  async disconnect(deviceId: string): Promise<void> {
    await this.ble.disconnect(deviceId);
  }
}
