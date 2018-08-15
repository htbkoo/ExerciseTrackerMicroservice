import { NextFunction, Request, Response } from "express";
import uuidv4 from "uuid/v4";

import User from "../../models/User";
import { ValidationErrors } from "../common";

/**
 * POST /api/exercise/new-user
 * Create a New User
 */

export let checkAddUserInputs = (req: Request): Promise<any> => {
    return new Promise(resolve => {
        req.check("username", ValidationErrors.USERNAME_MISSING).exists();
        resolve({req});
    });
};

export let postAddUser = (req: Request, res: Response, next: NextFunction) => {
    const {username} = req.body;
    const docs = {username, userId: newUserId()};
    const user = new User(docs);

    user.save()
        .then(() => {
            res.send(docs);
        })
        .catch(next);
};

function newUserId() {
    return uuidv4();
}