// src/adapters/ble/BLEPlxGateway.ts
import { BleManager, Device, Characteristic } from 'react-native-ble-plx';
import { BLEGateway, ScanResult } from '@app/ports/BLEGateway';
import { Peripheral, GattService, GattCharacteristic } from '@app/core/entities';

function deviceToPeripheral(d: Device): Peripheral {
  return {
    id: d.id,
    name: d.name ?? undefined,
    rssi: d.rssi ?? undefined,
    advertisement: {
      localName: d.localName ?? undefined,
      manufacturerDataHex: d.manufacturerData ?? undefined,
      serviceUuids: d.serviceUUIDs ?? undefined,
    },
  };
}

export class BLEPlxGateway implements BLEGateway {
  private manager = new BleManager();

  onScanResult(cb: (r: ScanResult) => void): () => void {
    const sub = this.manager.onDeviceDiscovered((d) => {
      cb({ device: deviceToPeripheral(d) });
    });
    return () => sub.remove();
  }

  async startScan(params?: { serviceUUIDs?: string[]; allowDuplicates?: boolean }): Promise<void> {
    await this.manager.startDeviceScan(params?.serviceUUIDs ?? null, { allowDuplicates: params?.allowDuplicates ?? false }, () => {});
  }

  async stopScan(): Promise<void> {
    this.manager.stopDeviceScan();
  }

  async connect(deviceId: string): Promise<void> {
    await this.manager.connectToDevice(deviceId, { timeout: 8000 });
  }

  async disconnect(deviceId: string): Promise<void> {
    try { await this.manager.cancelDeviceConnection(deviceId); } catch {}
  }

  async discoverServices(deviceId: string): Promise<GattService[]> {
    const device = await this.manager.discoverAllServicesAndCharacteristicsForDevice(deviceId);
    const services = await device.services();
    const result: GattService[] = [];
    for (const s of services) {
      const chars: Characteristic[] = await device.characteristicsForService(s.uuid);
      const mapped: GattCharacteristic[] = chars.map((c) => ({
        uuid: c.uuid,
        properties: {
          read: !!c.isReadable,
          write: !!c.isWritableWithResponse || !!c.isWritableWithoutResponse,
          notify: !!c.isNotifiable,
        },
      }));
      result.push({ uuid: s.uuid, characteristics: mapped });
    }
    return result;
  }

  async readCharacteristic(deviceId: string, serviceUUID: string, characteristicUUID: string): Promise<string> {
    const device = await this.manager.devices([deviceId]).then((arr) => arr[0]);
    if (!device) throw new Error('Device not found');
    const c = await device.readCharacteristicForService(serviceUUID, characteristicUUID);
    return c?.value ?? '';
  }

  async isBluetoothOn(): Promise<boolean> {
    const state = await this.manager.state();
    return state === 'PoweredOn';
  }
}
