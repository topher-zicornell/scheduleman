/**
 * A type for interpreting requests with both a body and path parameters..
 */
export default interface TypedRequestParamsBody<P, B> extends Express.Request {
  params: P;
  body: B;
}