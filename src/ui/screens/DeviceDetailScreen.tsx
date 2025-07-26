// src/ui/screens/DeviceDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@app/index';
import { useAppStore } from '@app/state/store';
import { ConnectDevice } from '@app/usecases/ConnectDevice';
import { ReadCharacteristic } from '@app/usecases/ReadCharacteristic';
import { BLEPlxGateway } from '@app/adapters/ble/BLEPlxGateway';

const ble = new BLEPlxGateway();
const connectUsecase = new ConnectDevice(ble);
const readUsecase = new ReadCharacteristic(ble);

export default function DeviceDetailScreen() {
  const { params } = useRoute<RouteProp<RootStackParamList, 'Device'>>();
  const services = useAppStore((s) => s.services);
  const setServices = useAppStore((s) => s.setServices);
  const device = useAppStore((s) => s.selected);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      setBusy(true);
    })();
  }, []);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setBusy(true);
        const discovered = await connectUsecase.connectAndDiscover(params.deviceId);
        if (mounted) setServices(discovered);
      } catch (e: any) {
        Alert.alert('Connection error', e?.message ?? 'Unable to connect');
      } finally {
        setBusy(false);
      }
    })();
    return () => {
      connectUsecase.disconnect(params.deviceId).catch(() => {});
      mounted = false;
    };
  }, [params.deviceId, setServices]);

  const onRead = async (svc: string, ch: string) => {
    try {
      setBusy(true);
      const v = await readUsecase.read(params.deviceId, svc, ch);
      Alert.alert('Read value (base64)', v || '(empty)');
    } catch (e: any) {
      Alert.alert('Read failed', e?.message ?? 'Unknown error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>{device?.name || '(no name)'}</Text>
      <Text selectable>ID: {device?.id}</Text>
      <Text>RSSI: {device?.rssi ?? 'n/a'}</Text>
      <Text style={{ marginTop: 16, fontWeight: '600' }}>GATT Services</Text>
      {services.map((s) => (
        <View key={s.uuid} style={{ paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee' }}>
          <Text style={{ fontWeight: '600' }}>{s.uuid}</Text>
          {s.characteristics.map((c) => (
            <View key={c.uuid} style={{ marginLeft: 12, marginTop: 6 }}>
              <Text>{c.uuid} · [R:{c.properties.read ? 'Y' : 'N'} W:{c.properties.write ? 'Y' : 'N'} N:{c.properties.notify ? 'Y' : 'N'}]</Text>
              {c.properties.read && (
                <TouchableOpacity onPress={() => onRead(s.uuid, c.uuid)} style={{ marginTop: 4 }}>
                  <Text style={{ color: '#1b5e20' }}>Read characteristic</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      ))}
      {busy && <Text style={{ marginTop: 12 }}>Working…</Text>}
    </ScrollView>
  );
}
