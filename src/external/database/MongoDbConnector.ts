import session from "express-session";
import logger from "../../util/logger";
import mongoose from "mongoose";
import mongo from "connect-mongo"; // INFO: import of connect-mongo MUST go AFTER import of mongoose, or the import will hang forever

import { NO_OP } from "../../util/objUtils";

type MongoStoreCreator = (s: typeof session) => mongo.MongoStore;

function setMongoosePromise(promiseClass: any) {
    (<any>mongoose).Promise = promiseClass;
}

function connectMongoose(mongoUrl: string) {
    return mongoose.connect(mongoUrl)
        .then(NO_OP) /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
        .catch(err => {
            logger.error("MongoDB connection error. Please make sure MongoDB is running. " + err);
            process.exit();
        });
}

function createMongoStore(s: typeof session, mongoUrl: string) {
    const MongoStore = mongo(s);
    return new MongoStore({
        url: mongoUrl,
        autoReconnect: true
    });
}

// Connect to MongoDB
function setupMongoDb(mongoUrl: string, promiseClass: any): { afterConnect: Promise<any>, getMongoStore: MongoStoreCreator } {
    setMongoosePromise(promiseClass);
    return {
        afterConnect: connectMongoose(mongoUrl),
        getMongoStore(s: typeof session) {
            return createMongoStore(s, mongoUrl);
        }
    };
}

export { setupMongoDb };