import DaoService, {DaoIoC} from './DaoService';
import NextExecution from '../entities/NextExecution';

/**
 * The Inversion of Control dependency map for this service.
 */
export interface NextExecutionDaoIoc extends DaoIoC {
}

/**
 * A Data Access Object (well, class) for working with the `next_execution` table.  This table is
 * responsible for tracking the next (only one) execution for everyt schedule.
 */
export default class NextExecutionDao extends DaoService {

  /** How many times to provide a task for execution. */
  tryLimit: number;

  /**
   * Create a new one of these with the given service configurations.
   * @param ioc
   *    The Inversion of Control services to inject into this service.
   */
  constructor(ioc: NextExecutionDaoIoc = {}) {
    super(ioc);

    this.tryLimit = Number(process.env.TRY_LIMIT || 3);
  }

  /**
   * Inserts an execution record for the given schedule at the given time.
   * @param executeAt
   *    The time at which this schedule should be executed.
   * @param scheduleId
   *    The schedule to execute.
   */
  async insertNextExecution(executeAt: Date, scheduleId: string): Promise<void> {
    const INSERT_SQL = `INSERT INTO next_execution 
        (schedule_id, execute_at) values (:scheduleId, :executeAt)`;
    await this.query(INSERT_SQL, {
      scheduleId: scheduleId,
      executeAt: executeAt,
    });
  }

  /**
   * Update the execution record for the given schedule to run at the given time.
   * @param executeAt
   *    The new time at which this schedule should be executed.
   * @param scheduleId
   *    The schedule for which the execution record will be updated.
   */
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

  /**
   * Find the next execution record for the given schedule, if there is one.
   * @param scheduleId
   *    The schedule for which to hunt.
   */
  async findNextExecution(scheduleId: string): Promise<NextExecution | undefined> {
    const QUERY_SQL = `SELECT execution_id, schedule_id, execute_at, started_at, try_count 
        FROM next_execution 
        WHERE schedule_id=:scheduleId`;
    const queryResponse = await this.query(QUERY_SQL, { scheduleId: scheduleId });
    if ((queryResponse.rowCount || 0) > 0) {
      return this.rowToNextExecution(queryResponse.rows[0]);
    }
  }

  /**
   * Remove the execution record for the given schedule.
   * @param scheduleId
   *    The schedule for which the execution record should be removed.
   */
  async clearNextExecution(scheduleId: string): Promise<void> {
    const nextExecution = await this.findNextExecution(scheduleId || '');
    if (nextExecution) {
      await this.deleteExecution(nextExecution.executionId);
    }
  }

  /**
   * Remove the given execution record.
   * @param executionId
   *    The id of the execution record to kack.
   */
  async deleteExecution(executionId: string): Promise<void> {
    const DELETE_SQL = `DELETE FROM next_execution WHERE execution_id=:executionId`;
    await this.query(DELETE_SQL, {
      executionId: executionId,
    });
  }

  /**
   * Find any execution records that should be executed.
   *
   * An execution record should be executed IF:
   *   - Its execution time is before the given `executeAt` time AND it has not already been
   *   started,
   *   - It has been started before the `timedoutAt` time AND its execution count is less than the
   *   configured `tryLimit`.
   *
   * @param timedoutAt
   *    The timeout time used in looking for failed jobs to try to re-trigger.
   * @param executeAt
   *    The execution time used in looking for new jobs to kick off.
   */
  async findToExecute(timedoutAt: Date, executeAt: Date): Promise<NextExecution | undefined> {
    const QUERY_SQL = `UPDATE next_execution SET 
        started_at=NOW(),
        try_count=try_count + 1
        WHERE execution_id=(
          SELECT execution_id FROM next_execution 
          WHERE 
            (started_at < :timedoutAt AND try_count < :tryLimit) OR 
            (execute_at < :executeAt AND started_at IS NULL)
          ORDER BY execute_at LIMIT 1
        )
        RETURNING execution_id, schedule_id, execute_at, started_at, try_count`;
    const queryResponse = await this.query(QUERY_SQL, {
      timedoutAt: timedoutAt,
      executeAt: executeAt,
      tryLimit: this.tryLimit,
    });
    if ((queryResponse.rowCount || 0) > 0) {
      return this.rowToNextExecution(queryResponse.rows[0]);
    }
  }

  /**
   * Converts a database result row to a `NextExecution` record.
   * @param row
   *    The DB row.
   * @private
   */
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