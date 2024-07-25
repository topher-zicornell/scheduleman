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
  db: Pool;

  constructor(ioc: DaoIoC = {}) {
    this.db = ioc.db || new Pool();
  }

  async query(queryStr: string, queryParams: QueryParams): Promise<QueryResult> {
    return await this.db.query(yesql.pg(queryStr, YesqlConfig)(queryParams));
  }
}