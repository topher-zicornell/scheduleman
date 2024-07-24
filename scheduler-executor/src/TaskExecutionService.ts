
import Schedule from 'scheduler-common-sdk/src/entities/Schedule';
import ReschedulerService from 'scheduler-common-sdk/src/services/ReschedulerService';
import ScheduleDao, {ScheduleDaoIoC} from 'scheduler-common-sdk/src/services/ScheduleDao';
import NextExecutionDao, {
  NextExecutionDaoIoc
} from 'scheduler-common-sdk/src/services/NextExecutionDao';

export interface TaskExecutionServiceIoC extends NextExecutionDaoIoc, ScheduleDaoIoC {
  rescheduler?: ReschedulerService;
  scheduleDao?: ScheduleDao;
  nextExecutionDao?: NextExecutionDao;
}

export default class TaskExecutionService {

  rescheduler: ReschedulerService;
  scheduleDao: ScheduleDao;
  nextExecutionDao: NextExecutionDao;
  timeoutMillis: number;
  toleranceMillis: number;

  constructor(ioc: TaskExecutionServiceIoC = {}) {
    this.rescheduler = ioc.rescheduler || new ReschedulerService();
    this.scheduleDao = ioc.scheduleDao || new ScheduleDao(ioc);
    this.nextExecutionDao = ioc.nextExecutionDao || new NextExecutionDao(ioc);
    this.timeoutMillis = (Number(process.env.TIMEOUT_SECONDS || '3') * 1000);
    this.toleranceMillis = (Number(process.env.START_TOLERANCE_SECONDS || '10') * 1000);
  }

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

  async executeTask(schedule: Schedule): Promise<void> {
    // Initiate the task
    await fetch(schedule.actionUrl, {
      method: 'POST',
      body: schedule.actionBody || '',
    });

    // Figure out the next execution
    const nextRunDate = this.rescheduler.determineNextDate(schedule.scheduleType,
        schedule.scheduleDetail);

    // Set up the next execution
    if (nextRunDate) {
      await this.nextExecutionDao.updateNextExecution(nextRunDate, schedule);
    }
  }
}