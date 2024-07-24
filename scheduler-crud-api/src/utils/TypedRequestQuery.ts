export default interface TypedRequestQuery<Q> extends Express.Request {
  query?: Q;
}
