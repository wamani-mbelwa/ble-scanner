// src/usecases/ScanDevices.ts
import { BLEGateway } from '@app/ports/BLEGateway';
import { Peripheral } from '@app/core/entities';

export type ScanState =
  | { kind: 'idle' }
  | { kind: 'scanning' }
  | { kind: 'error'; message: string };

export class ScanDevices {
  private unsubscribe?: () => void;

  constructor(private ble: BLEGateway) {}

  async start(
    onDevice: (p: Peripheral) => void,
    setState: (s: ScanState) => void,
    opts?: { serviceUUIDs?: string[] }
  ) {
    try {
      setState({ kind: 'scanning' });
      this.unsubscribe = this.ble.onScanResult((r) => onDevice(r.device));
      await this.ble.startScan({ serviceUUIDs: opts?.serviceUUIDs, allowDuplicates: false });
    } catch (e: any) {
      setState({ kind: 'error', message: e?.message ?? 'Failed to start scan' });
    }
  }

  async stop(setState: (s: ScanState) => void) {
    await this.ble.stopScan();
    this.unsubscribe?.();
    setState({ kind: 'idle' });
  }
}
