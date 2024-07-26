import Schedule from '../entities/Schedule';
import ScheduleException from '../utils/ScheduleException';
import DaoService, {DaoIoC} from './DaoService';

export interface ScheduleDaoIoC extends DaoIoC {
}

export default class ScheduleDao extends DaoService {

  constructor(ioc: ScheduleDaoIoC = {}) {
    super(ioc);
  }

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

  async listSchedules(): Promise<Schedule[]> {
    console.log('listSchedules');
    const QUERY_SQL = `SELECT
        schedule_id, action_url, action_body, schedule_type, schedule_detail 
        FROM schedule`;
    const queryResponse = await this.query(QUERY_SQL, {});
    console.log(`listSchedules: ${queryResponse.rowCount} rows read`);
    if (queryResponse.rows) {
      return queryResponse.rows.map((row) => (this.rowToSchedule(row)));
    }
    return [];
  }

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