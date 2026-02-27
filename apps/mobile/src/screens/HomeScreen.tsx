import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Alarm } from '../types';

export function HomeScreen({ alarms, onTriggerNow }: { alarms: Alarm[]; onTriggerNow: () => void }) {
  const next = alarms.find((a) => a.enabled);

  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>Alarm Clock MVP</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Next Alarm</Text>
        <Text style={styles.time}>{next?.time ?? '--:--'}</Text>
        <Text style={styles.meta}>{next?.label ?? 'No alarm configured'}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={onTriggerNow}>
        <Text style={styles.buttonText}>Trigger Test Alarm Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20, justifyContent: 'center' },
  heading: { color: '#fff', fontSize: 32, fontWeight: '700', marginBottom: 20 },
  card: { backgroundColor: '#131C34', borderRadius: 14, padding: 16, marginBottom: 20 },
  label: { color: '#A9B3CF' },
  time: { color: '#fff', fontSize: 42, fontWeight: '700', marginTop: 4 },
  meta: { color: '#A9B3CF', marginTop: 6 },
  button: { backgroundColor: '#5B8CFF', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
});
