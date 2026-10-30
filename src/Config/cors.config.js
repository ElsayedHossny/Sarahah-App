import { BadRequestException } from "../common/Utils/Error/exception.error.js";
import { envConfig } from "../Config/env.config.js";

const ORIGINS = envConfig.originDomains;

export const corsOptions = {
  origin: function (origin, callback) {
    if (!ORIGINS.includes(origin)) {
      callback(new BadRequestException("unAuthentication Origin"), ORIGINS);
    } else {
      callback(null, ORIGINS);
    }
  },
};
