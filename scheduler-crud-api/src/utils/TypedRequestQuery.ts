/**
 * A type for interpreting requests with query parameters.
 */
export default interface TypedRequestQuery<Q> extends Express.Request {
  query?: Q;
}
