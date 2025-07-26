// src/adapters/platform/permissions.ts
import { PermissionsAndroid, Platform } from 'react-native';

export async function ensureBlePermissions(): Promise<boolean> {
  if (Platform.OS === 'android') {
    const sdk = Number(Platform.constants?.Release) || 33;
    const needed = sdk >= 12
      ? ['android.permission.BLUETOOTH_SCAN', 'android.permission.BLUETOOTH_CONNECT']
      : ['android.permission.ACCESS_FINE_LOCATION'];

    const results = await PermissionsAndroid.requestMultiple(
      needed as unknown as PermissionsAndroid.Permission[]
    );
    const granted = Object.values(results).every((r) => r === PermissionsAndroid.RESULTS.GRANTED);
    return granted;
  }
  // iOS: RN BLE libs prompt automatically; return true.
  return true;
}
