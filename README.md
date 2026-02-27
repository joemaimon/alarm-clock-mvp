# Alarm Clock MVP (Anti-Oversleep)

Production-oriented starter for an anti-oversleep app with:
- Mobile app UI + wake-proof flow scaffolding
- Escalation rules engine (pure TypeScript)
- Companion web dashboard UI (settings/history/admin)

## Structure

- `apps/mobile` — React Native MVP scaffolding (Android-first)
- `apps/dashboard` — React web dashboard (v0-style UI with mock data)

## What’s implemented now

### Mobile
- Alarm list + next alarm card
- Alarm ringing state
- Wake Proof flow:
  - Voice phrase check (local text-match placeholder)
  - Second task options (Math / QR / Steps)
- Escalation stage progression engine
- Session result tracking in-memory (swap to SQLite next)

### Dashboard
- KPI cards (success rate, streak, fail count, avg dismiss)
- 14-day trend chart placeholder
- Alarm config list
- Session history table
- Escalation profile editor panel

## Next steps to make this fully production-ready
1. Add Android native modules for exact alarms + foreground service
2. Wire SQLite persistence for alarms/sessions
3. Integrate real speech recognition + QR camera + pedometer sensors
4. Add notifications + boot receiver restoration
5. Add optional cloud sync API

## Fast start (dashboard)
```bash
cd apps/dashboard
npm install
npm run dev
```

## Mobile start (scaffold)
Use your standard React Native setup (bare workflow recommended). This folder contains architecture and UI logic ready to wire into a native project.
