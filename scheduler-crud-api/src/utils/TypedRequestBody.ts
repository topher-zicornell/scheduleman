export default interface TypedRequestBody<B> extends Express.Request {
  body: B
}