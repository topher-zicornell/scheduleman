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

/**
 * The IoC for everything this service depends upon.
 */
export interface ScheduleManagementServiceIoC extends ScheduleDaoIoC, NextExecutionDaoIoc {
  rescheduler?: ReschedulerService;
  scheduleDao?: ScheduleDao;
  nextExecutionDao?: NextExecutionDao;
}

/**
 * This service handles management of schedule records.  It is limited to coordinating management
 * of schedule and execution records.  It does not process or execute any schedules or tasks.
 */
export default class ScheduleManagementService {
  /** Used to determine next execution details. */
  rescheduler: ReschedulerService;
  /** Used to interact with the Schedule table. */
  scheduleDao: ScheduleDao;
  /** Used to interact with the NextExecution table. */
  nextExecutionDao: NextExecutionDao;

  /**
   * Create a new one of these with the given service configurations.
   *
   * @param ioc
   *    The Inversion of Control services to inject into this service.
   */
  constructor(ioc: ScheduleManagementServiceIoC = {}) {
    this.rescheduler = ioc.rescheduler || new ReschedulerService();
    this.scheduleDao = ioc.scheduleDao || new ScheduleDao(ioc);
    this.nextExecutionDao = ioc.nextExecutionDao || new NextExecutionDao(ioc);
  }

  /**
   * Create a new schedule from the given API request.
   * @param request
   *    The details of the API request.  The body of this contains the schedule details.
   * @param response
   *    The response to be conveyed back to the caller.  The body of this is the newly created
   *    schedule record as it was inserted into the database.
   */
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

  /**
   * Grabs a schedule as identified in the given API request.
   * @param request
   *    The details of the API request.  The path parameters of this contains the id of the
   *    schedule to grab.
   * @param response
   *   The response to be conveyed back to the caller.  The body of this is the schedule record as
   *   it exists in the database.
   */
  async getSchedule(request: TypedRequestParams<SchedulePathParams>,
      response: TypedResponse<Schedule>) {
    // Look up the schedule from the DB by its id
    return await this.scheduleDao.getSchedule(request.params.scheduleId);
  }

  /**
   * Lists all the schedules according to the query given in the API request.
   *
   * At the moment, no query fields are included or supported in the database Schedule record.
   * Normally, this would be something like a calendar id, email address, owner id, etc.
   * @param request
   *    The details of the API request.  With no query fields, this is plain jane.
   * @param response
   *   The response to be conveyed back to the caller.  The body of this is the list of schedules.
   *   As a PoC, this is unpaged, so extra large lists might cause downstream clog monsters.
   */
  async listSchedules(request: TypedRequestQuery<ScheduleQuery>,
      response: TypedResponse<Schedule[]>) {
    // List all the schedules in the DB that match the query
    return await this.scheduleDao.listSchedules();
  }

  /**
   * Update a specified schedule from the given API request.
   * @param request
   *    The details of the API request.  The path parameters contains the schedule id and the body
   *    contains the schedule details.  If an id is included in the body, it'll be ignored.
   * @param response
   *    The response to be conveyed back to the caller.  The body of this is the newly updated
   *    schedule record as it now exists in the database.
   */
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

  /**
   * Delete the schedule specified in the given API request.
   * @param request
   *    The details of the API request.  The path parameters of this contains the id of the
   *    schedule to axe.
   * @param response
   *   The response to be conveyed back to the caller.  The body of this is the schedule record as
   *   it existed in the database before it was removified.
   */
  async deleteSchedule(request: TypedRequestParams<SchedulePathParams>,
      response: TypedResponse<Schedule>) {
    // Remove the next execution
    await this.nextExecutionDao.clearNextExecution(request.params.scheduleId);

    // Remove the schedule with the given id from the DB
    await this.scheduleDao.deleteSchedule(request.params.scheduleId);
  }
}
