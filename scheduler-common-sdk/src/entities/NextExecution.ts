/**
 * Represents a record in the `next_execution` table.
 */
export default interface NextExecution {
  /** The id for this record, assigned by the DB. */
  executionId: string;
  /** The id for the schedule this execution triggers. */
  scheduleId: string;
  /** When this execution should happen. */
  executeAt: Date;
  /** When the most recent attempt at this execution started. */
  startedAt?: Date;
  /** How many times this execution has been attempted. */
  tryCount: number;
}
