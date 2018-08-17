import { NextFunction, Request, Response } from "express";
import { DateTime } from "luxon";

import { todayInUtc } from "../../services/datetime/datetimeService";
import Exercise from "../../models/Exercise";
import logger from "../../util/logger";
import { ValidationErrors } from "../common";

const DATE_FORMAT = "yyyy-MM-dd";

/*
* POST /api/exercise/add
* Add exercise
* */

export let checkAddExerciseInputs = async (req: Request): Promise<any> => new Promise(resolve => {
    req.check("userId", ValidationErrors.USERID_MISSING).exists();
    req.check("description", ValidationErrors.DESCRIPTION_MISSING).exists();
    req.check("duration", ValidationErrors.DURATION_NOT_NUMERIC).isNumeric();
    checkDateFormat(req, "date", DATE_FORMAT);
    resolve({req});
});

export let postAddExercise = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = res.locals.user;
        const {description, duration, date} = req.body;
        const docs = {userId: user.userId, description, duration, date: firstDefined(date, todayInUtc())};
        const exercise = new Exercise(docs);
        await exercise.save();
        res.send({
            username: user.username,
            ...docs
        });
    } catch (e) {
        logger.warn(`Error caught: ${e.toString()}`);
        next(e);
    }
};

function checkDateFormat(req: Request, fieeld: string, acceptedDateFormat: string) {
    return (req.check(fieeld, ValidationErrors.DATE_WRONG_FORMAT)
        .optional() as any) // TODO: remove the usage of any once typing problem is gone
        .custom((value: any) => DateTime.fromFormat(value, acceptedDateFormat).isValid);
}

function firstDefined(nullable: any, orElse: any) {
    return !!nullable ? nullable : orElse;
}