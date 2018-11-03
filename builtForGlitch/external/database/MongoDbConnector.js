"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../util/logger"));
const mongoose_1 = __importDefault(require("mongoose"));
const connect_mongo_1 = __importDefault(require("connect-mongo")); // INFO: import of connect-mongo MUST go AFTER import of mongoose, or the import will hang forever
const objUtils_1 = require("../../util/objUtils");
function setMongoosePromise(promiseClass) {
    mongoose_1.default.Promise = promiseClass;
}
function connectMongoose(mongoUrl) {
    return mongoose_1.default.connect(mongoUrl)
        .then(objUtils_1.NO_OP) /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
        .catch(err => {
        logger_1.default.error("MongoDB connection error. Please make sure MongoDB is running. " + err);
        process.exit();
    });
}
function createMongoStore(s, mongoUrl) {
    const MongoStore = connect_mongo_1.default(s);
    return new MongoStore({
        url: mongoUrl,
        autoReconnect: true
    });
}
// Connect to MongoDB
function setupMongoDb(mongoUrl, promiseClass) {
    setMongoosePromise(promiseClass);
    return {
        afterConnect: connectMongoose(mongoUrl),
        getMongoStore(s) {
            return createMongoStore(s, mongoUrl);
        }
    };
}
exports.setupMongoDb = setupMongoDb;
//# sourceMappingURL=MongoDbConnector.js.map