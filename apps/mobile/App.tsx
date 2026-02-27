import React, { useMemo, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AlarmRingingScreen } from './src/screens/AlarmRingingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { WakeProofScreen } from './src/screens/WakeProofScreen';
import { Alarm, AlarmSession, AlarmStage, SecondTaskType } from './src/types';
import { createSession, getNextStage } from './src/engine/escalation';

const defaultAlarm: Alarm = {
  id: 'alarm-1',
  label: 'Weekday Wake Up',
  time: '07:00',
  enabled: true,
  requiredPhrase: 'I am awake and ready',
  secondTask: 'math',
};

type AppState = 'home' | 'ringing' | 'wakeProof' | 'done';

export default function App() {
  const [alarms] = useState<Alarm[]>([defaultAlarm]);
  const [state, setState] = useState<AppState>('home');
  const [session, setSession] = useState<AlarmSession | null>(null);
  const [taskType, setTaskType] = useState<SecondTaskType>(defaultAlarm.secondTask);

  const activeAlarm = alarms[0];

  const triggerAlarm = () => {
    const s = createSession(activeAlarm.id);
    setSession(s);
    setTaskType(activeAlarm.secondTask);
    setState('ringing');
  };

  const onTimeout = () => {
    if (!session) return;
    const next = getNextStage(session.stage);
    if (!next) {
      setSession({ ...session, result: 'fail' });
      setState('done');
      return;
    }
    setSession({ ...session, stage: next });
  };

  const onStartProof = () => setState('wakeProof');

  const onSuccess = () => {
    if (!session) return;
    setSession({ ...session, result: 'success' });
    setState('done');
  };

  const stageLabel = useMemo(() => {
    if (!session) return 'Stage 1';
    return `Stage ${session.stage}`;
  }, [session]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {state === 'home' && <HomeScreen alarms={alarms} onTriggerNow={triggerAlarm} />}

      {state === 'ringing' && session && (
        <AlarmRingingScreen
          stage={session.stage as AlarmStage}
          stageLabel={stageLabel}
          alarm={activeAlarm}
          onStartProof={onStartProof}
          onTimeout={onTimeout}
        />
      )}

      {state === 'wakeProof' && (
        <WakeProofScreen
          requiredPhrase={activeAlarm.requiredPhrase}
          secondTask={taskType}
          onSuccess={onSuccess}
          onFail={onTimeout}
          onSwitchTask={setTaskType}
        />
      )}

      {state === 'done' && (
        <View style={styles.doneWrap}>
          <Text style={styles.title}>{session?.result === 'success' ? '✅ Wake Success' : '❌ Wake Fail'}</Text>
          <Text style={styles.subtitle}>Session for {activeAlarm.label}</Text>
          <TouchableOpacity style={styles.button} onPress={() => setState('home')}>
            <Text style={styles.buttonText}>Back Home</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1020' },
  doneWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { color: '#fff', fontSize: 30, fontWeight: '700' },
  subtitle: { color: '#A9B3CF', marginTop: 12, marginBottom: 24 },
  button: { backgroundColor: '#5B8CFF', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  buttonText: { color: '#fff', fontWeight: '700' },
});
