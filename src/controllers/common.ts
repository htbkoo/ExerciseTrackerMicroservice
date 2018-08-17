"use strict";

import { NextFunction, Request, Response } from "express";
import { DateTime } from "luxon";

import logger from "../util/logger";

export type Controller = (req: Request, res: Response, next: NextFunction) => void;
export type ValidatorFunction = (req: Request, res: Response) => Promise<any>;

/**
 * validation common middleware wrapper
 */
export let validateFor = (fn: ValidatorFunction): Controller => {
    return (req: Request, res: Response, next: NextFunction) => {
        return fn(req, res)
            .then(({req}) => {
                    const errors = req.validationErrors();
                    if (errors) {
                        const e = JSON.stringify(errors);
                        logger.debug(`validation error: ${e}`);
                        req.flash("errors", errors);
                        return next(e);
                    }
                    next();
                }
            );

    };
};

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
    DATE_WRONG_FORMAT: "date must be in YYYY-MM-DD format",
});