"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression")); // compresses requests
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = __importDefault(require("body-parser"));
const logger_1 = __importDefault(require("./util/logger"));
const lusca_1 = __importDefault(require("lusca"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_flash_1 = __importDefault(require("express-flash"));
const path_1 = __importDefault(require("path"));
const passport_1 = __importDefault(require("passport"));
const express_validator_1 = __importDefault(require("express-validator"));
const bluebird_1 = __importDefault(require("bluebird"));
const MongoDbConnector_1 = require("./external/database/MongoDbConnector");
const secrets_1 = require("./util/secrets");
const http_status_1 = __importDefault(require("http-status"));
// Controllers (route handlers)
const api_1 = require("./controllers/api/api");
const common_1 = require("./controllers/common");
const exercise_1 = require("./controllers/api/exercise");
const user_1 = require("./controllers/api/user");
const home_1 = require("./controllers/home");
logger_1.default.info("Start setting up app.");
// Load environment variables from .env file, where API keys and passwords are configured
dotenv_1.default.config({ path: ".env.example" });
// Create Express server
const app = express_1.default();
// Connect to MongoDB
const mongoConnector = MongoDbConnector_1.setupMongoDb(secrets_1.MONGODB_URI, bluebird_1.default);
// Express configuration
app.set("port", process.env.PORT || 3000);
app.set("views", path_1.default.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(compression_1.default());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_validator_1.default());
app.use(express_session_1.default({
    resave: true,
    saveUninitialized: true,
    secret: secrets_1.SESSION_SECRET,
    store: mongoConnector.getMongoStore(express_session_1.default)
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_flash_1.default());
app.use(lusca_1.default.xframe("SAMEORIGIN"));
app.use(lusca_1.default.xssProtection(true));
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
app.use(express_1.default.static(path_1.default.join(__dirname, "public"), { maxAge: 31557600000 }));
/**
 * Primary app routes.
 */
app.get("/", home_1.appendUrlQueryStringIfMissing);
app.use(express_1.default.static(home_1.getPathToSwaggerUi())); // map "/" to swagger-ui page;
/**
 * API examples routes.
 */
app.get("/api", api_1.getApi);
app.post("/api/exercise/new-user", common_1.validateFor(user_1.checkAddUserInputs), user_1.postAddUser);
app.post("/api/exercise/add", common_1.validateFor(exercise_1.checkAddExerciseInputs), user_1.findUser, user_1.validateUserExists, exercise_1.postAddExercise);
app.get("/api/exercise/log", common_1.validateFor(exercise_1.checkGetExercisesInputs), user_1.findUser, user_1.validateUserExists, exercise_1.getExercises);
// noinspection JSUnusedLocalSymbols
app.use((err, req, res, next) => {
    console.debug(err.stack);
    const errorMessage = getErrorMessage();
    res.status(http_status_1.default.BAD_REQUEST).send(errorMessage);
    function getErrorMessage() {
        const hasMessageField = typeof err === "object" && "message" in err;
        return hasMessageField ? err.message : err.toString();
    }
});
exports.default = app;
//# sourceMappingURL=app.js.map