export enum ScheduleType {
  'RUNAT',  // Run at a specific date & time.
  'RUNIN',  // Run in an amount of time from now.
  'RUNON',  // Run on a specific schedule.
}

export default interface Schedule {
  scheduleId?: string;
  // ownerId: string;
  actionUrl: string;
  actionBody?: string;
  scheduleType: ScheduleType;
  scheduleDetail: string;
}
