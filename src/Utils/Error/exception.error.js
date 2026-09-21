import HttpAppError from "./app.error.js";

export class BadRequestException extends HttpAppError {
  constructor(message, data = {}) {
    super(message, 400, data, "BAD_REQUEST");
  }
}

export class UnauthorizedException extends HttpAppError {
  constructor(message, data = {}) {
    super(message, 401, data, "UNAUTHORIZED");
  }
}

export class ForbiddenException extends HttpAppError {
  constructor(message, data = {}) {
    super(message, 403, data, "FORBIDDEN");
  }
}

export class NotFoundException extends HttpAppError {
  constructor(message, data = {}) {
    super(message, 404, data, "NOT_FOUND");
  }
}

export class ConflictException extends HttpAppError {
  constructor(message, data = {}) {
    super(message, 409, data, "CONFLICT");
  }
}

export class UnprocessableEntityException extends HttpAppError {
  constructor(message, data = {}) {
    super(message, 422, data, "UNPROCESSABLE_ENTITY");
  }
}

export class TooManyRequestsException extends HttpAppError {
  constructor(message, data = {}) {
    super(message, 429, data, "TOO_MANY_REQUESTS");
  }
}

export class InternalServerErrorException extends HttpAppError {
  constructor(message, data = {}) {
    super(message, 500, data, "INTERNAL_SERVER_ERROR");
  }
}
