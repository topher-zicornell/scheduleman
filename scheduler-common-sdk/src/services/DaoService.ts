import {Pool, QueryResult} from 'pg';
import yesql from 'yesql';

const YesqlConfig = {
  useNullForMissing: true
}

type QueryParams = {
  [key: string]: any;
}

export interface DaoIoC {
  db?: Pool;
}

export default class DaoService {
  db: Pool;

  constructor(ioc: DaoIoC = {}) {
    this.db = ioc.db || new Pool();
  }

  async query(queryStr: string, queryParams: QueryParams): Promise<QueryResult> {
    return await this.db.query(yesql.pg(queryStr, YesqlConfig)(queryParams));
  }
}