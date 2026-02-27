import { createClient } from '@supabase/supabase-js';

export type TaskType = 'math' | 'qr' | 'steps';

export type WakePlan = {
  alarmTime: string;
  phrase: string;
  secondTask: TaskType;
  mathDifficulty: 'easy' | 'medium' | 'hard';
  qrLocation: string;
  requiredSteps: number;
  stage1Sec: number;
  stage2Sec: number;
  stage3Sec: number;
  backupAction: string;
};

export type AlarmSession = {
  id: string;
  date: string;
  status: 'success' | 'fail';
  dismissSec: number;
  stage: number;
};

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase = url && key ? createClient(url, key) : null;

export const defaultWakePlan: WakePlan = {
  alarmTime: '07:00',
  phrase: 'I am awake and ready',
  secondTask: 'math',
  mathDifficulty: 'medium',
  qrLocation: 'Bathroom sink',
  requiredSteps: 30,
  stage1Sec: 60,
  stage2Sec: 120,
  stage3Sec: 180,
  backupAction: 'Repeat alarm every 30s + local missed alert',
};

const LOCAL_PLAN_KEY = 'alarm_clock_wake_plan';

export function loadLocalWakePlan(): WakePlan {
  try {
    const raw = localStorage.getItem(LOCAL_PLAN_KEY);
    if (!raw) return defaultWakePlan;
    return { ...defaultWakePlan, ...JSON.parse(raw) };
  } catch {
    return defaultWakePlan;
  }
}

export function saveLocalWakePlan(plan: WakePlan) {
  localStorage.setItem(LOCAL_PLAN_KEY, JSON.stringify(plan));
}

export async function saveWakePlan(userId: string, plan: WakePlan) {
  if (!supabase) {
    saveLocalWakePlan(plan);
    return { ok: true, fallback: true as const };
  }

  const { error } = await supabase.from('wake_plans').upsert(
    {
      user_id: userId,
      alarm_time: plan.alarmTime,
      phrase: plan.phrase,
      second_task: plan.secondTask,
      math_difficulty: plan.mathDifficulty,
      qr_location: plan.qrLocation,
      required_steps: plan.requiredSteps,
      stage_1_sec: plan.stage1Sec,
      stage_2_sec: plan.stage2Sec,
      stage_3_sec: plan.stage3Sec,
      backup_action: plan.backupAction,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );

  if (error) throw error;
  return { ok: true, fallback: false as const };
}

export async function loadWakePlan(userId: string): Promise<WakePlan> {
  if (!supabase) return loadLocalWakePlan();

  const { data, error } = await supabase
    .from('wake_plans')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return defaultWakePlan;

  return {
    alarmTime: data.alarm_time,
    phrase: data.phrase,
    secondTask: data.second_task,
    mathDifficulty: data.math_difficulty,
    qrLocation: data.qr_location,
    requiredSteps: data.required_steps,
    stage1Sec: data.stage_1_sec,
    stage2Sec: data.stage_2_sec,
    stage3Sec: data.stage_3_sec,
    backupAction: data.backup_action,
  };
}

export async function loadSessions(userId: string): Promise<AlarmSession[]> {
  if (!supabase) {
    return [
      { id: 'S-1201', date: '2026-02-20', status: 'success', dismissSec: 68, stage: 2 },
      { id: 'S-1202', date: '2026-02-21', status: 'success', dismissSec: 52, stage: 2 },
      { id: 'S-1203', date: '2026-02-22', status: 'fail', dismissSec: 210, stage: 3 },
      { id: 'S-1204', date: '2026-02-23', status: 'success', dismissSec: 47, stage: 1 },
    ];
  }

  const { data, error } = await supabase
    .from('alarm_sessions')
    .select('id,date,status,dismiss_sec,stage_reached')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(30);

  if (error) throw error;

  return (data ?? []).map((s) => ({
    id: s.id,
    date: s.date,
    status: s.status,
    dismissSec: s.dismiss_sec,
    stage: s.stage_reached,
  }));
}
