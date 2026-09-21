class HttpAppError extends Error {
  constructor(
    message = "Internal Server Error",
    statusCode = 400,
    data = {},
    code = "BAD_REQUEST",
  ) {
    super(message);
    this.status = statusCode;
    this.data = data;
    this.code = code;
  }
}
export default HttpAppError;
