import Schedule from 'scheduler-common-sdk/src/entities/Schedule';
import TypedRequestBody from '../utils/TypedRequestBody';
import TypedResponse from '../utils/TypedResponse';
import TypedRequestQuery from '../utils/TypedRequestQuery';
import ScheduleQuery from '../entities/ScheduleQuery';
import TypedRequestParamsBody from '../utils/TypedRequestParamsBody';
import SchedulePathParams from '../entities/SchedulePathParams';
import TypedRequestParams from '../utils/TypedRequestParams';
import ReschedulerService from 'scheduler-common-sdk/src/services/ReschedulerService';
import ScheduleDao, {ScheduleDaoIoC} from 'scheduler-common-sdk/src/services/ScheduleDao';
import NextExecutionDao, {
  NextExecutionDaoIoc
} from 'scheduler-common-sdk/src/services/NextExecutionDao';

export interface ScheduleManagementServiceIoC extends ScheduleDaoIoC, NextExecutionDaoIoc {
  rescheduler?: ReschedulerService;
  scheduleDao?: ScheduleDao;
  nextExecutionDao?: NextExecutionDao;
}

export default class ScheduleManagementService {
  rescheduler: ReschedulerService;
  scheduleDao: ScheduleDao;
  nextExecutionDao: NextExecutionDao;

  constructor(ioc: ScheduleManagementServiceIoC = {}) {
    this.rescheduler = ioc.rescheduler || new ReschedulerService();
    this.scheduleDao = ioc.scheduleDao || new ScheduleDao(ioc);
    this.nextExecutionDao = ioc.nextExecutionDao || new NextExecutionDao(ioc);
  }

  async createSchedule(request: TypedRequestBody<Schedule>,
      response: TypedResponse<Schedule>) {
    // Figure out the next execution
    const nextRunDate = this.rescheduler.determineNextDate(request.body.scheduleType,
        request.body.scheduleDetail);

    // Shove the schedule into the DB
    const schedule = await this.scheduleDao.insertSchedule(request.body);

    // Shove the next execution into the DB
    if (nextRunDate) {
      await this.nextExecutionDao.insertNextExecution(nextRunDate, schedule);
    }

    return schedule;
  }

  async getSchedule(request: TypedRequestParams<SchedulePathParams>,
      response: TypedResponse<Schedule>) {
    // Look up the schedule from the DB by its id
    return await this.scheduleDao.getSchedule(request.params.scheduleId);
  }

  async listSchedules(request: TypedRequestQuery<ScheduleQuery>,
      response: TypedResponse<Schedule[]>) {
    // List all the schedules in the DB that match the query
    return await this.scheduleDao.listSchedules();
  }

  async updateSchedule(request: TypedRequestParamsBody<SchedulePathParams, Schedule>,
      response: TypedResponse<Schedule>) {
    // Figure out the next execution
    const nextRunDate = this.rescheduler.determineNextDate(request.body.scheduleType,
        request.body.scheduleDetail);

    // Update the schedule into the DB
    const schedule = await this.scheduleDao.updateSchedule(request.params.scheduleId, request.body);

    // Update the next execution into the DB
    if (nextRunDate) {
      await this.nextExecutionDao.updateNextExecution(nextRunDate, schedule);
    } else {
      await this.nextExecutionDao.clearNextExecution(request.params.scheduleId);
    }

    return schedule;
  }

  async deleteSchedule(request: TypedRequestParams<SchedulePathParams>,
      response: TypedResponse<Schedule>) {
    // Remove the next execution
    await this.nextExecutionDao.clearNextExecution(request.params.scheduleId);

    // Remove the schedule with the given id from the DB
    await this.scheduleDao.deleteSchedule(request.params.scheduleId);
  }
}
