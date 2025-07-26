// __tests__/connect.test.ts
import { ConnectDevice } from '@app/usecases/ConnectDevice';
import { BLEGateway } from '@app/ports/BLEGateway';

class FakeBLE implements BLEGateway {
  onScanResult(): () => void { return () => {}; }
  async startScan(): Promise<void> {}
  async stopScan(): Promise<void> {}
  async connect(): Promise<void> {}
  async disconnect(): Promise<void> {}
  async discoverServices(): Promise<any[]> { return [{ uuid: 'svc', characteristics: [] }]; }
  async readCharacteristic(): Promise<string> { return ''; }
  async isBluetoothOn(): Promise<boolean> { return true; }
}

test('connect and discover returns services', async () => {
  const usecase = new ConnectDevice(new FakeBLE());
  const svcs = await usecase.connectAndDiscover('abc');
  expect(svcs[0].uuid).toBe('svc');
});
