import { SecondTaskType } from '../types';

export function normalizeText(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
}

export function checkPhrase(expected: string, spoken: string): boolean {
  const e = normalizeText(expected);
  const s = normalizeText(spoken);
  if (!e || !s) return false;

  // Simple MVP fuzzy check: direct include both ways.
  return s.includes(e) || e.includes(s);
}

export function verifyTask(taskType: SecondTaskType, payload: { answer?: string; expected?: string; steps?: number; requiredSteps?: number; qr?: string; requiredQr?: string; }): boolean {
  switch (taskType) {
    case 'math':
      return payload.answer === payload.expected;
    case 'qr':
      return payload.qr === payload.requiredQr;
    case 'steps':
      return (payload.steps ?? 0) >= (payload.requiredSteps ?? 20);
    default:
      return false;
  }
}
