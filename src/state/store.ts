// src/state/store.ts
import { create } from 'zustand';
import { Peripheral, GattService } from '@app/core/entities';
import { ScanState } from '@app/usecases/ScanDevices';

type State = {
  scanState: ScanState;
  devices: Record<string, Peripheral>;
  selected?: Peripheral;
  services: GattService[];
};

type Actions = {
  setScanState: (s: ScanState) => void;
  upsertDevice: (p: Peripheral) => void;
  select: (p: Peripheral | undefined) => void;
  setServices: (s: GattService[]) => void;
  reset: () => void;
};

export const useAppStore = create<State & Actions>((set) => ({
  scanState: { kind: 'idle' },
  devices: {},
  services: [],
  setScanState: (s) => set({ scanState: s }),
  upsertDevice: (p) => set((prev) => ({ devices: { ...prev.devices, [p.id]: p } })),
  select: (p) => set({ selected: p, services: [] }),
  setServices: (s) => set({ services: s }),
  reset: () => set({ devices: {}, selected: undefined, services: [], scanState: { kind: 'idle' } }),
}));
