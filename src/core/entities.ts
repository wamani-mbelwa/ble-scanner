// src/core/entities.ts
export type UUID = string;

export type Rssi = number;

export interface PeripheralId {
  id: string;
}

export interface Advertisement {
  localName?: string;
  manufacturerDataHex?: string;
  serviceUuids?: UUID[];
}

export interface Peripheral {
  id: string;
  name?: string;
  rssi?: Rssi;
  advertisement?: Advertisement;
}

export interface GattCharacteristic {
  uuid: UUID;
  properties: {
    read: boolean;
    write: boolean;
    notify: boolean;
  };
}

export interface GattService {
  uuid: UUID;
  characteristics: GattCharacteristic[];
}

export class DomainError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'DomainError';
  }
}
