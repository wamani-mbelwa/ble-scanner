// src/index.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScanScreen from '@app/ui/screens/ScanScreen';
import DeviceDetailScreen from '@app/ui/screens/DeviceDetailScreen';

export type RootStackParamList = {
  Scan: undefined;
  Device: { deviceId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Scan" component={ScanScreen} options={{ title: 'BLE Scanner' }} />
        <Stack.Screen name="Device" component={DeviceDetailScreen} options={{ title: 'Device' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
