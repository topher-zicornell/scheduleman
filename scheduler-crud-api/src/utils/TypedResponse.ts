import { Send } from 'express-serve-static-core';

export default interface TypedResponse<T> extends Express.Response {
  json: Send<T, this>;
}