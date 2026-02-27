import { AlarmSession, AlarmStage } from '../types';

export const escalationConfig = {
  1: { timeoutSec: 60, volumePercent: 60, vibration: 'patternA' },
  2: { timeoutSec: 120, volumePercent: 85, vibration: 'patternB' },
  3: { timeoutSec: 180, volumePercent: 100, vibration: 'patternC' },
} as const;

export function createSession(alarmId: string): AlarmSession {
  return {
    id: `session-${Date.now()}`,
    alarmId,
    startedAt: Date.now(),
    stage: 1,
    result: 'active',
  };
}

export function getNextStage(stage: AlarmStage): AlarmStage | null {
  if (stage === 1) return 2;
  if (stage === 2) return 3;
  return null;
}
