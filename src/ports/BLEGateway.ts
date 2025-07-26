// src/ports/BLEGateway.ts
import { Peripheral, GattService } from '@app/core/entities';

export interface ScanResult {
  device: Peripheral;
}

export interface BLEGateway {
  startScan(params?: { serviceUUIDs?: string[]; allowDuplicates?: boolean }): Promise<void>;
  stopScan(): Promise<void>;
  onScanResult(cb: (r: ScanResult) => void): () => void;

  connect(deviceId: string): Promise<void>;
  disconnect(deviceId: string): Promise<void>;
  discoverServices(deviceId: string): Promise<GattService[]>;
  readCharacteristic(deviceId: string, serviceUUID: string, characteristicUUID: string): Promise<string>;
  isBluetoothOn(): Promise<boolean>;
}
