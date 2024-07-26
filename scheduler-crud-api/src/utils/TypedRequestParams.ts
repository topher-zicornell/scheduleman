/**
 * A type for interpreting requests with path parameters.
 */
export default interface TypedRequestParams<P> extends Express.Request {
  params: P;
}