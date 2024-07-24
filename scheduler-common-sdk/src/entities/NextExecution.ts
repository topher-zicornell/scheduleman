export default interface NextExecution {
  executionId: string;
  scheduleId: string;
  executeAt: Date;
  startedAt?: Date;
  tryCount: number;
}