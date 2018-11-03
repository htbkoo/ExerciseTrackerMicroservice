"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const datetimeService_1 = require("../../services/datetime/datetimeService");
const Exercise_1 = __importDefault(require("../../models/Exercise"));
const logger_1 = __importDefault(require("../../util/logger"));
const common_1 = require("../common");
const objUtils_1 = require("../../util/objUtils");
const DATE_FORMAT = "yyyy-MM-dd";
/*
* POST /api/exercise/add
* Add exercise
* */
exports.checkAddExerciseInputs = (req) => __awaiter(this, void 0, void 0, function* () {
    return new Promise(resolve => {
        req.check("userId", common_1.ValidationErrors.USERID_MISSING).exists();
        req.check("description", common_1.ValidationErrors.DESCRIPTION_MISSING).exists();
        req.check("duration", common_1.ValidationErrors.DURATION_NOT_NUMERIC).isNumeric();
        checkDateFormat(req, "date", DATE_FORMAT);
        resolve({ req });
    });
});
exports.postAddExercise = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const user = res.locals.user;
        const { description, duration, date } = req.body;
        const docs = { userId: user.userId, description, duration, date: objUtils_1.firstDefined(date, datetimeService_1.todayInUtc()) };
        const exercise = new Exercise_1.default(docs);
        yield exercise.save();
        res.send(Object.assign({ username: user.username }, docs));
    }
    catch (e) {
        logger_1.default.warn(`Error caught: ${e.toString()}`);
        next(e);
    }
});
/*
* GET /api/exercise/log?{userId}[&from][&to][&limit]
* GET users's exercise log
* { } = required, [ ] = optional
* from, to = dates (yyyy-mm-dd); limit = number
* */
exports.checkGetExercisesInputs = (req) => new Promise(resolve => {
    req.check("userId", common_1.ValidationErrors.USERID_MISSING).exists();
    req.check("limit", common_1.ValidationErrors.LIMIT_NOT_NUMERIC).optional().isNumeric();
    checkDateFormat(req, "from", DATE_FORMAT);
    checkDateFormat(req, "to", DATE_FORMAT);
    resolve({ req });
});
exports.getExercises = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const { userId, limit, from, to } = req.query;
    try {
        const { username } = res.locals.user;
        yield createQuery()
            .sort("-updatedAt")
            .exec()
            .then(exercises => res.send({
            userId,
            username,
            count: exercises.length,
            log: exercises.map(toResponseLog)
        }));
    }
    catch (e) {
        next(e);
    }
    function createQuery() {
        let query = Exercise_1.default.find({ userId });
        if (from) {
            query = query.where("date").gte(from);
        }
        if (to) {
            query = query.where("date").lte(to);
        }
        if (limit) {
            query = query.limit(parseInt(limit));
        }
        return query;
    }
});
function checkDateFormat(req, fieeld, acceptedDateFormat) {
    return req.check(fieeld, common_1.ValidationErrors.DATE_WRONG_FORMAT)
        .optional() // TODO: remove the usage of any once typing problem is gone
        .custom((value) => luxon_1.DateTime.fromFormat(value, acceptedDateFormat).isValid);
}
function toResponseLog(exercise) {
    const { duration, description, date } = exercise._doc;
    return { duration, description, date: formatDate(date) };
}
function formatDate(date) {
    return luxon_1.DateTime.fromFormat(date, DATE_FORMAT)
        .toLocaleString({ weekday: "short", month: "short", day: "2-digit", year: "numeric" });
}
//# sourceMappingURL=exercise.js.map