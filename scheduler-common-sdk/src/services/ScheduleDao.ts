import Schedule from '../entities/Schedule';
import ScheduleException from '../utils/ScheduleException';
import DaoService, {DaoIoC} from './DaoService';

/**
 * The Inversion of Control dependency map for this service.
 */
export interface ScheduleDaoIoC extends DaoIoC {
}

/**
 * A Data Access Object responsible for all things Schedule.
 */
export default class ScheduleDao extends DaoService {

  /**
   * Create a new one of these with the given service configurations.
   * @param ioc
   *    The Inversion of Control services to inject into this service.
   */
  constructor(ioc: ScheduleDaoIoC = {}) {
    super(ioc);
  }

  /**
   * Inserts a new schedule record.
   * @param schedule
   *    The schedule record to insert.
   */
  async insertSchedule(schedule: Schedule): Promise<Schedule> {
    const INSERT_SQL = `INSERT INTO schedule  
        (action_url, action_body, schedule_type, schedule_detail)
        VALUES
        (:actionUrl, :actionBody, :scheduleType, :scheduleDetail)
        RETURNING schedule_id, action_url, action_body, schedule_type, schedule_detail`;
    const insertResopnse = await this.query(INSERT_SQL, schedule);
    if (insertResopnse.rowCount != 1) {
      throw new ScheduleException(`The schedule could not be inserted`);
    }
    return this.rowToSchedule(insertResopnse.rows[0]);
  }

  /**
   * Updates the given schedule.  This will bork if the schedule cannot be found.
   * @param scheduleId
   *    The id of the schedule to be updated.  The id in the `schedule` argument is ignored and
   *    overwritten with this one.
   * @param schedule
   *    The schedule.
   */
  async updateSchedule(scheduleId: string, schedule: Schedule): Promise<Schedule> {
    // enforce the given scheduleId is in the schedule
    schedule.scheduleId = scheduleId;
    const UPDATE_SQL = `UPDATE schedule SET
        action_url=:actionUrl,
        action_body=:actionBody,
        schedule_type=:scheduleType,
        schedule_detail=:scheduleDetail
        WHERE
          schedule_id=:scheduleId
        RETURNING schedule_id, action_url, action_body, schedule_type, schedule_detail`;
    const updateResponse = await this.query(UPDATE_SQL, schedule);
    if (updateResponse.rowCount != 1) {
      throw new ScheduleException(`The given schedule could not be updated`);
    }
    return this.rowToSchedule(updateResponse.rows[0]);
  }

  /**
   * Retrieves the schedule record for the given id.
   * @param scheduleId
   *    The id of the schedule to be grabbed.
   */
  async getSchedule(scheduleId: string): Promise<Schedule> {
    const QUERY_SQL = `SELECT 
        schedule_id, action_url, action_body, schedule_type, schedule_detail 
        FROM schedule WHERE schedule_id=:scheduleId`;
    const queryResponse = await this.query(QUERY_SQL, { scheduleId: scheduleId });
    if (queryResponse.rowCount != 1) {
      throw new ScheduleException(`The given schedule could not be queried`);
    }
    return this.rowToSchedule(queryResponse.rows[0]);
  }

  /**
   * Lists all the schedule records.
   */
  async listSchedules(): Promise<Schedule[]> {
    const QUERY_SQL = `SELECT
        schedule_id, action_url, action_body, schedule_type, schedule_detail 
        FROM schedule`;
    const queryResponse = await this.query(QUERY_SQL, {});
    if (queryResponse.rows) {
      return queryResponse.rows.map((row) => (this.rowToSchedule(row)));
    }
    return [];
  }

  /**
   * Removes the given schedule.
   * @param scheduleId
   *    The id of the schedule to kack.
   */
  async deleteSchedule(scheduleId: string): Promise<Schedule> {
    const DELETE_SQL = `DELETE FROM schedule 
       WHERE schedule_id=:scheduleId
       RETURNING schedule_id, action_url, action_body, schedule_type, schedule_detail`;
    const deleteResponse = await this.query(DELETE_SQL, { scheduleId: scheduleId });
    if (deleteResponse.rowCount != 1) {
      throw new ScheduleException(`The given schedule could not be found to be deleted`);
    }
    return this.rowToSchedule(deleteResponse.rows[0]);
  }

  /**
   * Converts a database result row to a Schedule object.
   * @param row
   *    The DB row.
   * @private
   */
  private rowToSchedule(row: any): Schedule {
    return {
      scheduleId: row.schedule_id,
      actionUrl: row.action_url,
      actionBody: row.action_body,
      scheduleType: row.schedule_type,
      scheduleDetail: row.schedule_detail,
    };
  }
}