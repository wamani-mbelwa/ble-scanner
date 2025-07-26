# React Native BLE Scanner

A production grade React Native app in **TypeScript** that scans nearby **BLE** peripherals, displays **RSSI**, and enumerates **GATT** services/characteristics. Built with **Clean Architecture**, **Clean Code**, and **DDIA-inspired** stream/consistency notes.

## Quickstart
1. **Prereqs**: Node LTS, Yarn, JDK 17, Android Studio; on macOS for iOS: Xcode.
2. Clone and install:
   ```bash
   yarn install
   yarn typecheck && yarn lint && yarn test
   ```
3. Run (real device recommended):
   ```bash
   yarn android
   # or
   yarn ios
   ```

> Note: BLE requires **real devices**. Emulators/simulators won't expose Bluetooth radios.

## Features
- Start/stop scanning with live list (name/ID/RSSI/manufacturer data if present).
- Tap device → connect → enumerate GATT services/characteristics and read a safe sample characteristic.
- Android 12+ and iOS permission handling with user-friendly rationale.
- Errors: BT off, permission denied, device lost, timeouts — all surfaced with retry actions.
- Filters (name prefix, optional service UUID) and sorting by RSSI.

## Architecture (Clean Architecture)
- **core**: Entities/value-objects/errors (e.g., `Peripheral`, `GattService`).
- **usecases**: Pure application services (`ScanDevices`, `ConnectDevice`, `DiscoverGATT`, `ReadCharacteristic`).
- **ports**: `BLEGateway` interface.
- **adapters/ble**: Library-specific implementation using `react-native-ble-plx`.
- **adapters/platform**: Permission manager abstractions.
- **ui**: Presentational components, screens, and navigation.
- **state**: Store (Zustand) for UI consumption.
- **test**: Mocks and fixtures for integration tests.

## Library Choices
- BLE: **react-native-ble-plx** (mature API, good subscriptions for RSSI/scan results).
- State: **Zustand** (minimalistic, easy to test).
- Navigation: `@react-navigation/native` (+ native-stack).

## Permissions
### Android (12+ / API 31+)
We request: `BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT` and, on older targets, location permissions.
See `android/app/src/main/AndroidManifest.xml` for declarations.

### iOS
We declare `NSBluetoothAlwaysUsageDescription` in `Info.plist`. Background BLE is **not** implemented; see `docs/background-notes.md`.

## Tests
- **Unit**: usecases and core models.
- **Integration**: usecases × mocked `BLEGateway` adapter (no device required).
- **E2E (Detox minimal)**: Provided config scaffolding.

Run tests:
```bash
yarn test
```

## CI
GitHub Actions: lint + typecheck + unit tests + Android debug build, artifacts upload.

## DDIA Notes
- Scans are **ephemeral streams**; we avoid persisting raw events and instead derive UI state.
- We use **timeouts/backoff** for connect/read operations; see `usecases` for retry strategies.
- No external analytics; dev logger only.

## License
MIT
