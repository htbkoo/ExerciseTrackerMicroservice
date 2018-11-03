"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../util/logger"));
/**
 * validation common middleware wrapper
 */
exports.validateFor = (validate) => (req, res, next) => validate(req, res).then(({ req }) => {
    const errors = req.validationErrors();
    if (errors) {
        handleError();
    }
    else {
        next();
    }
    function handleError() {
        const e = JSON.stringify(errors);
        logger_1.default.debug(`validation error: ${e}`);
        req.flash("errors", errors);
        next(e);
    }
});
/**
 * Returns the value of param name when present,  in the following order: req.params, req.body, req.query
 * Just to provide a handy fallback method to mimic req.param (https://expressjs.com/en/4x/api.html#req.param)
 * This is because since express v4.11, req.param() is deprecated
 * Reference: https://github.com/expressjs/expressjs.com/issues/314
 */
exports.getParam = (req, key, defaultValue) => {
    return req.params[key] || req.body[key] || req.query[key] || defaultValue;
};
exports.ValidationErrors = Object.freeze({
    USERNAME_DUPLICATED: "'{VALUE}' is already in use, expected it to be unique.",
    USERNAME_MISSING: "username is missing",
    USERID_MISSING: "userId is missing",
    DESCRIPTION_MISSING: "description is missing",
    DURATION_NOT_NUMERIC: "duration must be numeric",
    LIMIT_NOT_NUMERIC: "limit must be numeric",
    DATE_WRONG_FORMAT: "date must be in YYYY-MM-DD format",
});
//# sourceMappingURL=common.js.map