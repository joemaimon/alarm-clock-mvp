# Supabase Setup (Phase A)

1) Create a Supabase project.
2) In SQL Editor, run:

```sql
create table if not exists wake_plans (
  user_id text primary key,
  alarm_time text not null,
  phrase text not null,
  second_task text not null check (second_task in ('math','qr','steps')),
  math_difficulty text not null check (math_difficulty in ('easy','medium','hard')),
  qr_location text not null,
  required_steps int not null,
  stage_1_sec int not null,
  stage_2_sec int not null,
  stage_3_sec int not null,
  backup_action text not null,
  updated_at timestamptz not null default now()
);

create table if not exists alarm_sessions (
  id text primary key,
  user_id text not null,
  date date not null,
  status text not null check (status in ('success','fail')),
  dismiss_sec int not null,
  stage_reached int not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_alarm_sessions_user_date on alarm_sessions(user_id, date desc);
```

3) Project settings → API:
- copy `Project URL`
- copy `anon public key`

4) In Vercel project env vars, add:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

5) Redeploy.

## Current behavior
- If env vars are missing, app falls back to localStorage.
- If env vars are set, wake plans + sessions use Supabase.
