import session from "express-session";
import logger from "../../util/logger";
import mongo from "connect-mongo";
import mongoose from "mongoose";

import { NO_OP } from "../../util/objUtils";

function setMongoosePromise(promiseClass: any) {
    (<any>mongoose).Promise = promiseClass;
}

function connectMongoose(mongoUrl: string) {
    return mongoose.connect(mongoUrl, {useMongoClient: true})
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

type MongoStoreCreator = (s: typeof session) => mongo.MongoStore

// Connect to MongoDB
function setupMongoDb(mongoUrl: string, promiseClass: any): { afterConnect: Promise<void>, getMongoStore: MongoStoreCreator } {
    setMongoosePromise(promiseClass);
    return {
        afterConnect: connectMongoose(mongoUrl),
        getMongoStore(s: typeof session) {
            return createMongoStore(s, mongoUrl);
        }
    };
}

export { setupMongoDb };