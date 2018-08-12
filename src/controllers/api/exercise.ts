import { NextFunction, Request, Response } from "express";
import { todayInUtc } from "../../services/datetime/datetimeService";
import Exercise from "../../models/Exercise";
import User from "../../models/User";
import logger from "../../util/logger";
import { DateTime } from "luxon";


/*
* POST /api/exercise/add
* Add exercise
* */

export let checkAddExerciseInputs = (req: Request): Promise<any> => {
    return new Promise(resolve => {
        req.check("userId", "userId is missing").exists();
        req.check("description", "description is missing").exists();
        req.check("duration", "duration must be numeric").isNumeric();
        // @ts-ignore
        req.check("date", "date must be in YYYY-MM-DD format").optional().custom((value) => {
            return DateTime.fromFormat(value, "yyyy-MM-dd").isValid;
        });
        resolve({req});
    });
};

export let postAddExercise = (req: Request, res: Response, next: NextFunction) => {
    const {userId, description, duration, date} = req.body;
    const docs = {userId, description, duration, date: !!date ? date : todayInUtc()};
    const exercise = new Exercise(docs);
    exercise.save()
        .then(() => {
            // TODO: to improve in case user not found
            return User.findOne({userId});
        })
        .then(user => {
            logger.debug(`Corresponding user with id=${userId} is ${user.toString()}`);
            res.send({
                username: user.username,
                ...docs
            });
        })
        .catch(next);
};
