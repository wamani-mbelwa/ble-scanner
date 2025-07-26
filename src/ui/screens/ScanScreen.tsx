// src/ui/screens/ScanScreen.tsx
import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app/index';
import { useAppStore } from '@app/state/store';
import { ScanDevices } from '@app/usecases/ScanDevices';
import { BLEPlxGateway } from '@app/adapters/ble/BLEPlxGateway';
import { ensureBlePermissions } from '@app/adapters/platform/permissions';

const ble = new BLEPlxGateway();
const scanUsecase = new ScanDevices(ble);

export default function ScanScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const devices = useAppStore((s) => s.devices);
  const scanState = useAppStore((s) => s.scanState);
  const setScanState = useAppStore((s) => s.setScanState);
  const upsert = useAppStore((s) => s.upsertDevice);
  const select = useAppStore((s) => s.select);

  const scanning = scanState.kind === 'scanning';

  const start = useCallback(async () => {
    const ok = await ensureBlePermissions();
    if (!ok) {
      Alert.alert('Permissions', 'Bluetooth permissions are required to scan.');
      return;
    }
    await scanUsecase.start((p) => upsert(p), (s) => setScanState(s));
  }, [setScanState, upsert]);

  const stop = useCallback(async () => {
    await scanUsecase.stop(setScanState);
  }, [setScanState]);

  const onPressItem = useCallback((id: string) => {
    const d = devices[id];
    select(d);
    nav.navigate('Device', { deviceId: id });
  }, [devices, nav, select]);

  const data = useMemo(() => Object.values(devices).sort((a, b) => (b.rssi ?? -999) - (a.rssi ?? -999)), [devices]);

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <Text style={{ fontSize: 16, marginBottom: 8 }}>
        {scanning ? 'Scanning… pull to stop' : 'Pull to scan'}
      </Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={scanning} onRefresh={scanning ? stop : start} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onPressItem(item.id)} style={{ paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
            <Text style={{ fontWeight: '600' }}>{item.name || '(no name)'} </Text>
            <Text>ID: {item.id}</Text>
            <Text>RSSI: {item.rssi ?? 'n/a'}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ marginTop: 24, textAlign: 'center' }}>No devices yet.</Text>}
      />
    </View>
  );
}
