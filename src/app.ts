import express, { NextFunction, Request, Response } from "express";
import compression from "compression"; // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import logger from "./util/logger";
import lusca from "lusca";
import dotenv from "dotenv";
import flash from "express-flash";
import path from "path";
import passport from "passport";
import expressValidator from "express-validator";
import bluebird from "bluebird";
import { setupMongoDb } from "./external/database/MongoDbConnector";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";
import HttpStatus from "http-status";
// Controllers (route handlers)
import { getApi } from "./controllers/api/api";
import { validateFor } from "./controllers/common";
import {
    checkAddExerciseInputs,
    checkGetExercisesInputs,
    getExercises,
    postAddExercise
} from "./controllers/api/exercise";
import { checkAddUserInputs, findUser, postAddUser, validateUserExists } from "./controllers/api/user";
import { getPathToSwaggerUi } from "./controllers/home";

logger.info("Start setting up app.");

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({path: ".env.example"});

// Create Express server
const app = express();

// Connect to MongoDB
const mongoConnector = setupMongoDb(MONGODB_URI, bluebird);

// Express configuration
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: mongoConnector.getMongoStore(session)
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

app.use(
    express.static(path.join(__dirname, "public"), {maxAge: 31557600000})
);

/**
 * Primary app routes.
 */
app.get("/", (req: Request, res: Response, next: NextFunction) => {
    if (!("url" in req.query)) {
        console.debug(`no url in query, populating`);
        res.redirect("/?url=swagger/swagger.json");
    } else {
        console.debug(`url already populated in query, next`);
        next();
    }
});
app.use(express.static(getPathToSwaggerUi())); // map "/" to swagger-ui page;

/**
 * API examples routes.
 */
app.get("/api", getApi);
app.post("/api/exercise/new-user", validateFor(checkAddUserInputs), postAddUser);
app.post("/api/exercise/add", validateFor(checkAddExerciseInputs), findUser, validateUserExists, postAddExercise);
app.get("/api/exercise/log", validateFor(checkGetExercisesInputs), findUser, validateUserExists, getExercises);


// noinspection JSUnusedLocalSymbols
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.debug(err.stack);

    const errorMessage = getErrorMessage();
    res.status(HttpStatus.BAD_REQUEST).send(errorMessage);

    function getErrorMessage() {
        const hasMessageField = typeof err === "object" && "message" in err;
        return hasMessageField ? err.message : err.toString();
    }
});

export default app;