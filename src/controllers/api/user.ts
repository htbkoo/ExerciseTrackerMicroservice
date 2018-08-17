import { NextFunction, Request, Response } from "express";
import uuidv4 from "uuid/v4";

import User from "../../models/User";
import { getParam, ValidationErrors } from "../common";
import logger from "../../util/logger";

export let findUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const userId = getParam(req, "userId");
    res.locals.user = await User.findOne({userId});
    next();
};

export let validateUserExists = (req: Request, res: Response, next: NextFunction) => {
    const {user} = res.locals;
    const isUserExist = user !== null;
    if (isUserExist) {
        const {userId} = user;
        logger.debug(`Corresponding user with id=${userId} is ${user.toString()}`);
        next();
    } else {
        const userId = getParam(req, "userId");
        next(new Error(`userId '${userId}' matches no user`));
    }
};

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