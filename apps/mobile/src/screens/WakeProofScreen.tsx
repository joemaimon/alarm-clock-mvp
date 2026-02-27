import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { checkPhrase, verifyTask } from '../engine/wakeProof';
import { SecondTaskType } from '../types';

function randMath() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  return { q: `${a} + ${b}`, ans: `${a + b}` };
}

export function WakeProofScreen({
  requiredPhrase,
  secondTask,
  onSuccess,
  onFail,
  onSwitchTask,
}: {
  requiredPhrase: string;
  secondTask: SecondTaskType;
  onSuccess: () => void;
  onFail: () => void;
  onSwitchTask: (next: SecondTaskType) => void;
}) {
  const [spoken, setSpoken] = useState('');
  const [answer, setAnswer] = useState('');
  const [qr, setQr] = useState('BATHROOM_QR');
  const [steps, setSteps] = useState('0');
  const [status, setStatus] = useState('');

  const math = useMemo(() => randMath(), []);

  const handleVerify = () => {
    const phraseOk = checkPhrase(requiredPhrase, spoken);
    if (!phraseOk) {
      setStatus('Voice phrase failed. Try speaking clearly.');
      onFail();
      return;
    }

    const taskOk =
      secondTask === 'math'
        ? verifyTask('math', { answer, expected: math.ans })
        : secondTask === 'qr'
        ? verifyTask('qr', { qr, requiredQr: 'BATHROOM_QR' })
        : verifyTask('steps', { steps: Number(steps), requiredSteps: 20 });

    if (!taskOk) {
      setStatus('Second task failed. Alarm escalates.');
      onFail();
      return;
    }

    setStatus('Wake proof passed.');
    onSuccess();
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>Wake Proof</Text>
      <Text style={styles.label}>Required phrase</Text>
      <Text style={styles.phrase}>“{requiredPhrase}”</Text>
      <TextInput placeholder="Type recognized speech here" placeholderTextColor="#7F8AA8" value={spoken} onChangeText={setSpoken} style={styles.input} />

      <View style={styles.taskRow}>
        {(['math', 'qr', 'steps'] as SecondTaskType[]).map((t) => (
          <TouchableOpacity key={t} style={[styles.chip, secondTask === t && styles.chipActive]} onPress={() => onSwitchTask(t)}>
            <Text style={styles.chipText}>{t.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {secondTask === 'math' && (
        <>
          <Text style={styles.label}>Solve: {math.q}</Text>
          <TextInput style={styles.input} value={answer} onChangeText={setAnswer} keyboardType="number-pad" />
        </>
      )}

      {secondTask === 'qr' && (
        <>
          <Text style={styles.label}>Scan QR (simulate payload)</Text>
          <TextInput style={styles.input} value={qr} onChangeText={setQr} />
        </>
      )}

      {secondTask === 'steps' && (
        <>
          <Text style={styles.label}>Walk 20 steps (simulate steps)</Text>
          <TextInput style={styles.input} value={steps} onChangeText={setSteps} keyboardType="number-pad" />
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify & Dismiss</Text>
      </TouchableOpacity>

      {!!status && <Text style={styles.status}>{status}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20, justifyContent: 'center' },
  heading: { color: '#fff', fontSize: 30, fontWeight: '700', marginBottom: 20 },
  label: { color: '#A9B3CF', marginBottom: 6 },
  phrase: { color: '#fff', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#24304F',
    color: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: '#11192D',
  },
  taskRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  chip: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10, backgroundColor: '#1A2642' },
  chipActive: { backgroundColor: '#5B8CFF' },
  chipText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  button: { backgroundColor: '#5B8CFF', borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: '700' },
  status: { color: '#FFD166', marginTop: 12 },
});
