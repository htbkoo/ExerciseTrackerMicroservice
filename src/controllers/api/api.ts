"use strict";

import { Request, Response } from "express";
import { DateTime } from "luxon";

/**
 * GET /api
 * List of API examples.
 */
export let getApi = (req: Request, res: Response) => {
    res.render("api/index", {
        title: "API Examples"
    });
};