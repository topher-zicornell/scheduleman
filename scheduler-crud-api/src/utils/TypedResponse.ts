import { Send } from 'express-serve-static-core';

/**
 * A type for interpreting responses with a body.
 */
export default interface TypedResponse<T> extends Express.Response {
  json: Send<T, this>;
}