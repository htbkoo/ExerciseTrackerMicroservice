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
