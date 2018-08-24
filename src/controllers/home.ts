import { absolutePath as getPathToSwaggerUi } from "swagger-ui-dist";
import { NextFunction, Request, Response } from "express";

/**
 * GET /
 * Home page by swagger-ui
 */
export { getPathToSwaggerUi };

export const appendUrlQueryStringIfMissing = (req: Request, res: Response, next: NextFunction) => {
    if (!("url" in req.query)) {
        console.debug(`no url in query, populating`);
        res.redirect("/?url=swagger/swagger.json");
    } else {
        console.debug(`url already populated in query, next`);
        next();
    }
};