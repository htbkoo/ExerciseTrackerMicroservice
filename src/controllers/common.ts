"use strict";

import { NextFunction, Request, RequestHandler, Response } from "express";
import { DateTime } from "luxon";

import logger from "../util/logger";

export type ValidatorFunction = (req: Request, res: Response) => Promise<any>;

/**
 * validation common middleware wrapper
 */
export let validateFor = (validate: ValidatorFunction): RequestHandler =>
    (req: Request, res: Response, next: NextFunction): any =>
        validate(req, res).then(({req}) => {
                const errors = req.validationErrors();
                if (errors) {
                    handleError();
                } else {
                    next();
                }

                function handleError(): void {
                    const e = JSON.stringify(errors);
                    logger.debug(`validation error: ${e}`);
                    req.flash("errors", errors);
                    next(e);
                }
            }
        );

/**
 * Returns the value of param name when present,  in the following order: req.params, req.body, req.query
 * Just to provide a handy fallback method to mimic req.param (https://expressjs.com/en/4x/api.html#req.param)
 * This is because since express v4.11, req.param() is deprecated
 * Reference: https://github.com/expressjs/expressjs.com/issues/314
 */
export let getParam = (req: Request, key: string, defaultValue?: any): any => {
    return req.params[key] || req.body[key] || req.query[key] || defaultValue;
};

export const ValidationErrors = Object.freeze({
    USERNAME_DUPLICATED: "'{VALUE}' is already in use, expected it to be unique.",
    USERNAME_MISSING: "username is missing",
    USERID_MISSING: "userId is missing",
    DESCRIPTION_MISSING: "description is missing",
    DURATION_NOT_NUMERIC: "duration must be numeric",
    LIMIT_NOT_NUMERIC: "limit must be numeric",
    DATE_WRONG_FORMAT: "date must be in YYYY-MM-DD format",
});