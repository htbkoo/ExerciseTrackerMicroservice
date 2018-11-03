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
const v4_1 = __importDefault(require("uuid/v4"));
const User_1 = __importDefault(require("../../models/User"));
const common_1 = require("../common");
const logger_1 = __importDefault(require("../../util/logger"));
exports.findUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const userId = common_1.getParam(req, "userId");
    res.locals.user = yield User_1.default.findOne({ userId });
    next();
});
exports.validateUserExists = (req, res, next) => {
    const { user } = res.locals;
    const isUserExist = user !== null;
    if (isUserExist) {
        const { userId } = user;
        logger_1.default.debug(`Corresponding user with id=${userId} is ${user.toString()}`);
        next();
    }
    else {
        const userId = common_1.getParam(req, "userId");
        next(new Error(`userId '${userId}' matches no user`));
    }
};
/**
 * POST /api/exercise/new-user
 * Create a New User
 */
exports.checkAddUserInputs = (req) => {
    return new Promise(resolve => {
        req.check("username", common_1.ValidationErrors.USERNAME_MISSING).exists();
        resolve({ req });
    });
};
exports.postAddUser = (req, res, next) => {
    const { username } = req.body;
    const docs = { username, userId: newUserId() };
    const user = new User_1.default(docs);
    user.save()
        .then(() => {
        res.send(docs);
    })
        .catch(next);
};
function newUserId() {
    return v4_1.default();
}
//# sourceMappingURL=user.js.map