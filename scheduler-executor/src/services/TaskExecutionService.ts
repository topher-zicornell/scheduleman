import Schedule, {ScheduleType} from 'scheduler-common-sdk/src/entities/Schedule';
import ReschedulerService from 'scheduler-common-sdk/src/services/ReschedulerService';
import ScheduleDao, {ScheduleDaoIoC} from 'scheduler-common-sdk/src/services/ScheduleDao';
import NextExecutionDao, {
  NextExecutionDaoIoc
} from 'scheduler-common-sdk/src/services/NextExecutionDao';

/**
 * The IoC for everything this service depends upon.
 */
export interface TaskExecutionServiceIoC extends NextExecutionDaoIoc, ScheduleDaoIoC {
  rescheduler?: ReschedulerService;
  scheduleDao?: ScheduleDao;
  nextExecutionDao?: NextExecutionDao;
}

/**
 * This service handles execution of scheduled tasks.  In this PoC, the only trigger supported is
 * a webhook API call.
 */
export default class TaskExecutionService {
  /** Used to determine the next execution once this one is completed. */
  rescheduler: ReschedulerService;
  /** Used to interact with the Schedule table. */
  scheduleDao: ScheduleDao;
  /** Used to interact with the NextExecution table. */
  nextExecutionDao: NextExecutionDao;

  /**
   * Configuration for how long a webhook call has before it times out.  This can be set using an
   * environment variable, TIMEOUT_SECONDS.  Default is 3.
   */
  timeoutMillis: number;
  /**
   * Configuration for how much flux is tolerated in the schedule execution.  This determines how
   * many seconds *before* the scheduled time, the "findNextTask" method will hunt.  Anything that
   * has not been executed that is *after* the schedule time is fair game, regardless of this
   * setting.  This can be set using an environment variable, START_TOLERANCE_SECONDS.  Default
   * is 10.
   */
  toleranceMillis: number;

  /**
   * Create a new one of these with the given service configurations.
   * @param ioc
   *    The Inversion of Control services to inject into this service.
   */
  constructor(ioc: TaskExecutionServiceIoC = {}) {
    this.rescheduler = ioc.rescheduler || new ReschedulerService();
    this.scheduleDao = ioc.scheduleDao || new ScheduleDao(ioc);
    this.nextExecutionDao = ioc.nextExecutionDao || new NextExecutionDao(ioc);
    this.timeoutMillis = (Number(process.env.TIMEOUT_SECONDS || '3') * 1000);
    this.toleranceMillis = (Number(process.env.START_TOLERANCE_SECONDS || '10') * 1000);
  }

  /**
   * Find the next task to be executed.  This only returns one task, and returns the oldest it can
   * find.  It includes both tasks that have not yet executed and tasks that have already been
   * executed, but the initial trigger timed out.
   *
   * If there are no tasks to execute, nothing is returned.
   */
  async findNextTask(): Promise<Schedule | undefined> {
    // Figure out the time-boundaries for executable tasks
    const timeoutAt = new Date(Date.now() - this.timeoutMillis);
    const executeAt = new Date(Date.now() - this.toleranceMillis);

    // See if we have any tasks to execute
    const task = await this.nextExecutionDao.findToExecute(timeoutAt, executeAt);
    if (task) {
      return await this.scheduleDao.getSchedule(task.scheduleId);
    }
  }

  /**
   * Execute the given task.  This only "triggers" the task.  This does not track, nor have
   * visibility to the execution of the task.
   *
   * On completion of the triggering, the next execution for this task (if there is one) will be
   * determined and scheduled for future execution.
   * @param schedule
   *    The full schedule record of the task to be executed.
   */
  async executeTask(schedule: Schedule): Promise<void> {
    // Initiate the task
    await fetch(schedule.actionUrl, {
      method: 'POST',
      body: schedule.actionBody || '',
    });

    // Figure out the next execution, but only for RUNON jobs
    if (schedule.scheduleType == ScheduleType.RUNON) {
      const nextRunDate = this.rescheduler.determineNextDate(schedule.scheduleType,
          schedule.scheduleDetail);
      if (nextRunDate) {
        await this.nextExecutionDao.updateNextExecution(nextRunDate, schedule);
      }
    }
  }
}
