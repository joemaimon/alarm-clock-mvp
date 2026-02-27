import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { escalationConfig } from '../engine/escalation';
import { Alarm, AlarmStage } from '../types';

export function AlarmRingingScreen({
  alarm,
  stage,
  stageLabel,
  onStartProof,
  onTimeout,
}: {
  alarm: Alarm;
  stage: AlarmStage;
  stageLabel: string;
  onStartProof: () => void;
  onTimeout: () => void;
}) {
  const timeout = escalationConfig[stage].timeoutSec;
  const [left, setLeft] = useState(timeout);

  useEffect(() => {
    setLeft(timeout);
  }, [timeout, stage]);

  useEffect(() => {
    if (left <= 0) {
      onTimeout();
      return;
    }
    const id = setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => clearTimeout(id);
  }, [left, onTimeout]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.alert}>⏰ WAKE UP</Text>
      <Text style={styles.alarmName}>{alarm.label}</Text>
      <Text style={styles.stage}>{stageLabel}</Text>
      <Text style={styles.timer}>Escalates in {left}s</Text>
      <Text style={styles.meta}>Volume: {escalationConfig[stage].volumePercent}%</Text>

      <TouchableOpacity style={styles.button} onPress={onStartProof}>
        <Text style={styles.buttonText}>Start Wake Proof</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  alert: { color: '#FF5D6C', fontSize: 44, fontWeight: '800' },
  alarmName: { color: '#fff', fontSize: 24, marginTop: 8 },
  stage: { color: '#FFD166', fontSize: 18, marginTop: 10 },
  timer: { color: '#fff', fontSize: 30, fontWeight: '700', marginTop: 20 },
  meta: { color: '#A9B3CF', marginTop: 8, marginBottom: 20 },
  button: { backgroundColor: '#5B8CFF', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
  buttonText: { color: '#fff', fontWeight: '700' },
});
