import { NextFunction, Request, Response } from "express";
import User from "../../models/User";

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
        .catch(next);
};

function getUserId() {
    return "someId";
}