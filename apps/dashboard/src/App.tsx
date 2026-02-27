import React, { useEffect, useMemo, useState } from 'react';
import { AlarmSession, TaskType, WakePlan, defaultWakePlan, loadSessions, loadWakePlan, saveWakePlan } from './lib';

const DEMO_USER_ID = 'joe-demo';

export function App() {
  const [plan, setPlan] = useState<WakePlan>(defaultWakePlan);
  const [sessions, setSessions] = useState<AlarmSession[]>([]);
  const [statusMsg, setStatusMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [loadedPlan, loadedSessions] = await Promise.all([
          loadWakePlan(DEMO_USER_ID),
          loadSessions(DEMO_USER_ID),
        ]);

        if (!mounted) return;
        setPlan(loadedPlan);
        setSessions(loadedSessions);
      } catch (e) {
        if (!mounted) return;
        setStatusMsg(`Load failed: ${(e as Error).message}`);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const successCount = sessions.filter((s) => s.status === 'success').length;
  const successRate = sessions.length ? Math.round((successCount / sessions.length) * 100) : 0;
  const avgDismiss = sessions.length
    ? Math.round(sessions.reduce((acc, s) => acc + s.dismissSec, 0) / sessions.length)
    : 0;

  const wakeSummary = useMemo(() => {
    if (plan.secondTask === 'math') return `Voice + ${plan.mathDifficulty} math`;
    if (plan.secondTask === 'qr') return `Voice + QR at ${plan.qrLocation}`;
    return `Voice + ${plan.requiredSteps} steps`;
  }, [plan]);

  const set = <K extends keyof WakePlan>(key: K, value: WakePlan[K]) => setPlan((p) => ({ ...p, [key]: value }));

  const onSave = async () => {
    try {
      const result = await saveWakePlan(DEMO_USER_ID, plan);
      setStatusMsg(result.fallback ? 'Saved locally (set Supabase env vars for cloud save).' : 'Saved to cloud ✅');
    } catch (e) {
      setStatusMsg(`Save failed: ${(e as Error).message}`);
    }
  };

  return (
    <div className="page">
      <header>
        <h1>Alarm Clock</h1>
        <p>Clean wake setup + anti-oversleep controls</p>
      </header>

      {loading ? (
        <section className="panel">Loading wake plan...</section>
      ) : (
        <>
          <section className="kpis">
            <Card title="Success Rate" value={`${successRate}%`} sub="Recent wake sessions" />
            <Card title="Current Streak" value="3 days" sub="Consecutive successful wakes" />
            <Card title="Avg Dismiss" value={`${avgDismiss}s`} sub="Time to complete wake proof" />
          </section>

          <section className="panel">
            <h2>Wake Setup (Primary)</h2>
            <div className="grid2">
              <label>
                Alarm time
                <input type="time" value={plan.alarmTime} onChange={(e) => set('alarmTime', e.target.value)} />
              </label>

              <label>
                Required phrase
                <input value={plan.phrase} onChange={(e) => set('phrase', e.target.value)} placeholder="I am awake and ready" />
              </label>

              <label>
                Second task
                <select value={plan.secondTask} onChange={(e) => set('secondTask', e.target.value as TaskType)}>
                  <option value="math">Math challenge</option>
                  <option value="qr">QR scan</option>
                  <option value="steps">Step walk</option>
                </select>
              </label>

              {plan.secondTask === 'math' && (
                <label>
                  Math difficulty
                  <select value={plan.mathDifficulty} onChange={(e) => set('mathDifficulty', e.target.value as WakePlan['mathDifficulty'])}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </label>
              )}

              {plan.secondTask === 'qr' && (
                <label>
                  QR location label
                  <input value={plan.qrLocation} onChange={(e) => set('qrLocation', e.target.value)} />
                </label>
              )}

              {plan.secondTask === 'steps' && (
                <label>
                  Required steps
                  <input
                    type="number"
                    min={10}
                    value={plan.requiredSteps}
                    onChange={(e) => set('requiredSteps', Number(e.target.value || 0))}
                  />
                </label>
              )}
            </div>

            <div className="summary">
              <b>Current wake proof:</b> {wakeSummary}
            </div>
          </section>

          <section className="panel">
            <h2>Escalation Rules</h2>
            <div className="grid3">
              <label>Stage 1 timeout (sec)<input type="number" value={plan.stage1Sec} onChange={(e) => set('stage1Sec', Number(e.target.value || 0))} /></label>
              <label>Stage 2 timeout (sec)<input type="number" value={plan.stage2Sec} onChange={(e) => set('stage2Sec', Number(e.target.value || 0))} /></label>
              <label>Stage 3 timeout (sec)<input type="number" value={plan.stage3Sec} onChange={(e) => set('stage3Sec', Number(e.target.value || 0))} /></label>
            </div>
            <label>
              Backup action
              <input value={plan.backupAction} onChange={(e) => set('backupAction', e.target.value)} />
            </label>
            <button onClick={onSave}>Save Wake Plan</button>
            {!!statusMsg && <div className="status">{statusMsg}</div>}
          </section>

          <section className="panel">
            <h2>Wake Session History</h2>
            <table>
              <thead>
                <tr>
                  <th>Session</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Dismiss (s)</th>
                  <th>Stage Reached</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.date}</td>
                    <td><span className={s.status === 'success' ? 'chip ok' : 'chip bad'}>{s.status}</span></td>
                    <td>{s.dismissSec}</td>
                    <td>{s.stage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
}

function Card({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <div className="card">
      <div className="card-title">{title}</div>
      <div className="card-value">{value}</div>
      <div className="card-sub">{sub}</div>
    </div>
  );
}
