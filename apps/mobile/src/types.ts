export type SecondTaskType = 'math' | 'qr' | 'steps';

export type Alarm = {
  id: string;
  label: string;
  time: string;
  enabled: boolean;
  requiredPhrase: string;
  secondTask: SecondTaskType;
};

export type AlarmResult = 'success' | 'fail' | 'active';

export type AlarmStage = 1 | 2 | 3;

export type AlarmSession = {
  id: string;
  alarmId: string;
  startedAt: number;
  stage: AlarmStage;
  result: AlarmResult;
};
