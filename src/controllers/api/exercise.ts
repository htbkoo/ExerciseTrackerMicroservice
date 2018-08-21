import { NextFunction, Request, Response } from "express";
import { DateTime } from "luxon";

import { todayInUtc } from "../../services/datetime/datetimeService";
import Exercise from "../../models/Exercise";
import logger from "../../util/logger";
import { ValidationErrors } from "../common";
import { firstDefined } from "../../util/objUtils";

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

/*
* GET /api/exercise/log?{userId}[&from][&to][&limit]
* GET users's exercise log
* { } = required, [ ] = optional
* from, to = dates (yyyy-mm-dd); limit = number
* */

export let checkGetExercisesInputs = (req: Request): Promise<any> => new Promise(resolve => {
    req.check("userId", ValidationErrors.USERID_MISSING).exists();
    req.check("limit", ValidationErrors.LIMIT_NOT_NUMERIC).optional().isNumeric();
    checkDateFormat(req, "from", DATE_FORMAT);
    checkDateFormat(req, "to", DATE_FORMAT);
    resolve({req});
});

export let getExercises = async (req: Request, res: Response, next: NextFunction) => {
    const {userId, limit, from, to} = req.query;

    try {
        const {username} = res.locals.user;
        await createQuery()
            .sort("-updatedAt")
            .exec()
            .then(exercises =>
                res.send({
                    userId,
                    username,
                    count: exercises.length,
                    log: exercises.map(toResponseLog)
                })
            );
    } catch (e) {
        next(e);
    }

    function createQuery() {
        let query = Exercise.find({userId});
        if (from) {
            query = query.where("date").gte(from);
        }
        if (limit) {
            query = query.limit(parseInt(limit));
        }
        return query;
    }
};

function checkDateFormat(req: Request, fieeld: string, acceptedDateFormat: string) {
    return (req.check(fieeld, ValidationErrors.DATE_WRONG_FORMAT)
        .optional() as any) // TODO: remove the usage of any once typing problem is gone
        .custom((value: any) => DateTime.fromFormat(value, acceptedDateFormat).isValid);
}

type ResponseLog = { duration: number, description: string, date: string };

function toResponseLog(exercise: any): ResponseLog {
    const {duration, description, date} = exercise._doc;
    return {duration, description, date: formatDate(date)};
}

function formatDate(date: string): string {
    return DateTime.fromFormat(date, DATE_FORMAT)
        .toLocaleString({weekday: "short", month: "short", day: "2-digit", year: "numeric"});
}
