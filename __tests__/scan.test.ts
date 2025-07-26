// __tests__/scan.test.ts
import { ScanDevices } from '@app/usecases/ScanDevices';
import { BLEGateway, ScanResult } from '@app/ports/BLEGateway';
import { Peripheral } from '@app/core/entities';

class FakeBLE implements BLEGateway {
  onScanResult(cb: (r: ScanResult) => void): () => void {
    setTimeout(() => cb({ device: { id: '1', name: 'Demo', rssi: -50 } as Peripheral }), 5);
    return () => {};
  }
  async startScan(): Promise<void> {}
  async stopScan(): Promise<void> {}
  async connect(): Promise<void> {}
  async disconnect(): Promise<void> {}
  async discoverServices(): Promise<any[]> { return []; }
  async readCharacteristic(): Promise<string> { return ''; }
  async isBluetoothOn(): Promise<boolean> { return true; }
}

test('ScanDevices updates scan state and emits devices', async () => {
  const ble = new FakeBLE();
  const usecase = new ScanDevices(ble);
  const seen: Peripheral[] = [];
  let state: any = { kind: 'idle' };
  await usecase.start((p) => seen.push(p), (s) => (state = s));
  expect(state.kind).toBe('scanning');
  await new Promise((r) => setTimeout(r, 10));
  expect(seen.length).toBeGreaterThan(0);
  await usecase.stop((s) => (state = s));
  expect(state.kind).toBe('idle');
});
