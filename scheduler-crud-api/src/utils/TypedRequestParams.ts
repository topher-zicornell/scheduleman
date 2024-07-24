export default interface TypedRequestParams<P> extends Express.Request {
  params: P;
}