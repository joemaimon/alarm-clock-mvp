# Mobile App (React Native Scaffold)

This folder contains the Alarm Clock MVP UI + rules-engine wiring.

## Included
- Home screen
- Alarm ringing screen with escalation timer
- Wake proof screen (voice phrase + one task)
- Escalation state transitions

## Production wiring needed
- Android exact alarms (`AlarmManager.setExactAndAllowWhileIdle`)
- Foreground service during active alarm
- Boot receiver re-scheduling
- Native audio/vibration loops
- Real voice/QR/steps sensor verification
- SQLite persistence
