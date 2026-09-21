class HttpAppError extends Error {
  constructor(
    message,
    source,
    statusCode = 400,
    data = {},
    code = "BAD_REQUEST",
  ) {
    super(message);

    this.source = source;
    this.status = statusCode;
    this.data = data;
    this.code = code;
  }
}
export default HttpAppError;
