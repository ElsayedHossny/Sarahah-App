import HttpAppError from "./app.error.js";

export class BadRequestException extends HttpAppError {
  constructor(message, source, data = {}, code = "CONFLICT") {
    super(message, source, 409, data, code);
  }
}
