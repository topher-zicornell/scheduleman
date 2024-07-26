import {Pool, QueryResult} from 'pg';
import yesql from 'yesql';

/**
 * Configuration for the yesql parameterization tool.
 *
 * useNullForMissing ensures the SQL parameters passed to the DB don't include
 * any 'undefined' rather than 'null'.
 */
const YesqlConfig = {
  useNullForMissing: true
}

/** A simple container type for query parameters. */
type QueryParams = {
  [key: string]: any;
}

/** The Inversion of Control dependency map for this service. */
export interface DaoIoC {
  db?: Pool;
}

/**
 * This service provides the basic functionality needed for DAO services.  This can (and often is)
 * enhanced with convenience tools around transactions and other commonly encountered things.  For
 * this PoC, simplicity is still possible.
 */
export default class DaoService {
  /** The DB connection pool. */
  db: Pool;

  /**
   * Create a new one of these with the given service configurations.
   *
   * @param ioc
   *    The Inversion of Control services to inject into this service.
   */
  constructor(ioc: DaoIoC = {}) {
    this.db = ioc.db || new Pool();
  }

  /**
   * Executes the given query or statement through the connection pool, parsing in named
   * parameters.
   *
   * @param queryStr
   *    The query or statement to execute.
   * @param queryParams
   *    A map of the parameters to bind to the query or statement.
   */
  async query(queryStr: string, queryParams: QueryParams): Promise<QueryResult> {
    return await this.db.query(yesql.pg(queryStr, YesqlConfig)(queryParams));
  }
}