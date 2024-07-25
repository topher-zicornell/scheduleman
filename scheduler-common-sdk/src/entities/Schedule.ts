/**
 * All the possible schedule types supported.
 */
export enum ScheduleType {
  'RUNAT',  // Run at a specific date & time.
  'RUNIN',  // Run in an amount of time from now.
  'RUNON',  // Run on a specific schedule.
}

/**
 * Represents a record in the `schedule` table.
 */
export default interface Schedule {
  /** The id of this record, assigned by the DB. */
  scheduleId?: string;
  /** The URL to call to initiate this task. */
  actionUrl: string;
  /** The body of the call to initiate this task. */
  actionBody?: string;
  /** The type of schedule governing the executions for this schedule. */
  scheduleType: ScheduleType;
  /** The details of the schedule, depending on the type. */
  scheduleDetail: string;
}
