"use strict";

import { NextFunction, Request, Response } from "express";
import Exercise from "../models/Exercise";
import User from "../models/User";
import logger from "../util/logger";
import { todayInUtc } from "../services/datetime/datetimeService";

/**
 * GET /api
 * List of API examples.
 */
export let getApi = (req: Request, res: Response) => {
    res.render("api/index", {
        title: "API Examples"
    });
};

/**
 * POST /api/exercise/new-user
 * Create a New User
 */
export let postAddUser = (req: Request, res: Response, next: NextFunction) => {
    req.check("username", "username is missing").exists();

    const errors = req.validationErrors();
    if (errors) {
        req.flash("errors", errors);
        // return res.redirect("/");
        return next(JSON.stringify(errors));
    }

    const {username} = req.body;
    const docs = {username, userId: getUserId()};
    const user = new User(docs);

    user.save()
        .then(() => {
            res.send(docs);
        })
        .catch(error => {
            logger.error(error);
            next(error);
        });
};

function getUserId() {
    return "someId";
}

/*
* POST /api/exercise/add
* Add exercise
* */

export let postAddExercise = (req: Request, res: Response, next: NextFunction) => {
    req.check("userId", "userId is missing").exists();
    req.check("description", "description is missing").exists();
    req.check("duration", "duration must be numeric").isNumeric();

    const errors = req.validationErrors();
    if (errors) {
        req.flash("errors", errors);
        // return res.redirect("/");
        return next(JSON.stringify(errors));
    }

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
        .catch(error => {
            logger.error(error);
            next(error);
        });
};