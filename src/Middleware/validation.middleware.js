import { BadRequestException } from "../Utils/Error/exception.error.js";

export const ValidationMiddleWare = (schema) => {
  return (req, res, next) => {
    const validationResult = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    // const validationResult = schema.safeParse(req.body);

    if (!validationResult.success) {
      throw new BadRequestException(
        "Validation Schema",
        validationResult.error.issues,
      );
    }

    req.validate = validationResult.data;
    next();
  };
};
