import React from 'react';

const sessions = Array.from({ length: 8 }).map((_, i) => ({
  id: `S-${1020 + i}`,
  date: `2026-02-${String(10 + i).padStart(2, '0')}`,
  status: i % 4 === 0 ? 'fail' : 'success',
  dismissSec: 45 + i * 12,
  stage: i % 3 === 0 ? 3 : 2,
}));

export function App() {
  const successCount = sessions.filter((s) => s.status === 'success').length;
  const successRate = Math.round((successCount / sessions.length) * 100);
  const avgDismiss = Math.round(sessions.reduce((acc, s) => acc + s.dismissSec, 0) / sessions.length);

  return (
    <div className="page">
      <header>
        <h1>Alarm Clock — Control Dashboard</h1>
        <p>Offline-first wake compliance + escalation monitoring</p>
      </header>

      <section className="kpis">
        <Card title="Success Rate" value={`${successRate}%`} sub="Last 8 sessions" />
        <Card title="Current Streak" value="5 days" sub="No oversleeps" />
        <Card title="Failed Wakes" value={`${sessions.length - successCount}`} sub="Needs profile tuning" />
        <Card title="Avg Dismiss" value={`${avgDismiss}s`} sub="Time to wake proof" />
      </section>

      <section className="grid2">
        <div className="panel">
          <h2>Alarm Configurations</h2>
          <ul className="list">
            <li><b>Weekday 07:00</b> · Voice + Math · Stage 3 max</li>
            <li><b>Gym 06:00</b> · Voice + Steps(30) · Stage 2 max</li>
            <li><b>Weekend 08:30</b> · Voice + QR(bathroom) · Stage 3 max</li>
          </ul>
        </div>

        <div className="panel">
          <h2>Escalation Profile Editor (v0)</h2>
          <label>Stage 1 timeout (sec)<input defaultValue={60} /></label>
          <label>Stage 2 timeout (sec)<input defaultValue={120} /></label>
          <label>Stage 3 timeout (sec)<input defaultValue={180} /></label>
          <label>Backup action<input defaultValue="Repeat alarm + local missed alert" /></label>
          <button>Save Profile</button>
        </div>
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
                <td>
                  <span className={s.status === 'success' ? 'chip ok' : 'chip bad'}>{s.status}</span>
                </td>
                <td>{s.dismissSec}</td>
                <td>{s.stage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
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
