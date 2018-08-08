"use strict";

import graph from "fbgraph";
import { NextFunction, Request, Response } from "express";
import Exercise from "../models/Exercise";
import User from "../models/User";
import logger from "../util/logger";

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
 * GET /api/facebook
 * Facebook API example.
 */
export let getFacebook = (req: Request, res: Response, next: NextFunction) => {
    const token = req.user.tokens.find((token: any) => token.kind === "facebook");
    graph.setAccessToken(token.accessToken);
    graph.get(`${req.user.facebook}?fields=id,name,email,first_name,last_name,gender,link,locale,timezone`, (err: Error, results: graph.FacebookUser) => {
        if (err) {
            return next(err);
        }
        res.render("api/facebook", {
            title: "Facebook API",
            profile: results
        });
    });
};

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
    const docs = {userId, description, duration, date: !!date ? date : todayInString()};
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

function todayInString() {
    return "2018-08-04";
}