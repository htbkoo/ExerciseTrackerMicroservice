"use strict";

import { Request, Response } from "express";
import { DateTime } from "luxon";

/**
 * GET /api
 * List of API examples (by redirecting to /)
 */
export let getApi = (req: Request, res: Response) => {
    res.redirect("/");
};