/**
 * A type for interpreting requests with a body.
 */
export default interface TypedRequestBody<B> extends Express.Request {
  body: B
}