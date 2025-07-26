# Background Scanning Notes

This focuses on **foreground** scanning. Background scanning on iOS/Android has additional constraints:
- iOS requires specific background modes and limited intervals; strict App Store policies apply.
- Android background scans need careful battery management and foreground services.

For production apps, consider OS guidelines and implement conservative duty-cycles with user controls.
