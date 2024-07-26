import DaoService, {DaoIoC} from './DaoService';
import NextExecution from '../entities/NextExecution';

export interface NextExecutionDaoIoc extends DaoIoC {
}

export default class NextExecutionDao extends DaoService {

  constructor(ioc: NextExecutionDaoIoc = {}) {
    super(ioc);
  }

  async insertNextExecution(executeAt: Date, scheduleId: string): Promise<void> {
    const INSERT_SQL = `INSERT INTO next_execution 
        (schedule_id, execute_at) values (:scheduleId, :executeAt)`;
    await this.query(INSERT_SQL, {
      scheduleId: scheduleId,
      executeAt: executeAt,
    });
  }

  async updateNextExecution(executeAt: Date, scheduleId: string): Promise<void> {
    const nextExecution = await this.findNextExecution(scheduleId || '');
    if (nextExecution) {
      const UPDATE_QUERY = `UPDATE next_execution 
        SET execute_at=:executeAt 
        WHERE execution_id=:executionId`;
      await this.query(UPDATE_QUERY, {
        executeAt: executeAt,
        executionId: nextExecution.executionId
      })
    } else {
      await this.insertNextExecution(executeAt, scheduleId);
    }
  }

  async findNextExecution(scheduleId: string): Promise<NextExecution | undefined> {
    const QUERY_SQL = `SELECT execution_id, schedule_id, execute_at, started_at, try_count 
        FROM next_execution 
        WHERE schedule_id=:scheduleId`;
    const queryResponse = await this.query(QUERY_SQL, { scheduleId: scheduleId });
    if ((queryResponse.rowCount || 0) > 0) {
      return this.rowToNextExecution(queryResponse.rows[0]);
    }
  }

  async clearNextExecution(scheduleId: string): Promise<void> {
    const nextExecution = await this.findNextExecution(scheduleId || '');
    if (nextExecution) {
      await this.deleteExecution(nextExecution.executionId);
    }
  }

  async deleteExecution(executionId: string): Promise<void> {
    const DELETE_SQL = `DELETE FROM next_execution WHERE execution_id=:executionId`;
    await this.query(DELETE_SQL, {
      executionId: executionId,
    });
  }

  async findToExecute(timedoutAt: Date, executeAt: Date): Promise<NextExecution | undefined> {
    const QUERY_SQL = `UPDATE next_execution SET 
        started_at=NOW(),
        try_count=try_count + 1
        WHERE execution_id=(
          SELECT execution_id FROM next_execution 
          WHERE 
            (started_at < :timedoutAt) OR 
            (execute_at < :executeAt AND started_at IS NULL)
          ORDER BY execute_at LIMIT 1
        )
        RETURNING execution_id, schedule_id, execute_at, started_at, try_count`;
    const queryResponse = await this.query(QUERY_SQL, {
      timedoutAt: timedoutAt,
      executeAt: executeAt,
    });
    if ((queryResponse.rowCount || 0) > 0) {
      return this.rowToNextExecution(queryResponse.rows[0]);
    }
  }

  private rowToNextExecution(row: any): NextExecution {
    return {
      executionId: row.execution_id,
      scheduleId: row.schedule_id,
      executeAt: row.execute_at,
      startedAt: row.started_at,
      tryCount: row.try_count
    };
  }
}