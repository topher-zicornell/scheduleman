export default interface TypedRequestParamsBody<P, B> extends Express.Request {
  params: P;
  body: B;
}