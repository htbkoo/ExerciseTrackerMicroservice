import session from "express-session";
import mongoose from "mongoose";
import mongo from "connect-mongo";

import logger from "../../../util/logger"; // INFO: import of connect-mongo MUST go AFTER import of mongoose, or the import will hang forever

type MongoStoreCreator = (s: typeof session) => mongo.MongoStore;

const mongoUri: string = (<any>global).__MONGO_URI__;
if (!mongoUri) {
    logger.error(`mongoUri is ${mongoUri} - very likely the tests will fail`);
}

function setMongoosePromise(promiseClass: any) {
    (<any>mongoose).Promise = promiseClass;
}

async function connectMongoose() {
    const mongooseOpts = { // options for mongoose 4.11.3 and above
        autoReconnect: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000,
    };

    mongoose.connection.on("error", (e) => {
        if (e.message.code === "ETIMEDOUT") {
            console.log(e);
            mongoose.connect(mongoUri, mongooseOpts);
        }
        console.log(e);
    });

    mongoose.connection.once("open", () => {
        console.log(`MongoDB successfully connected to ${mongoUri}`);
    });

    return mongoose.connect(mongoUri, mongooseOpts);
}

function createMongoStore(s: typeof session, mongoUrl: string) {
    const MongoStore = mongo(s);
    return new MongoStore({
        url: mongoUrl,
        autoReconnect: true
    });
}

// Connect to MongoDB
// noinspection JSUnusedGlobalSymbols
function setupMongoDb(_: string, promiseClass: any): { afterConnect: Promise<any>, getMongoStore: MongoStoreCreator } {
    setMongoosePromise(promiseClass);
    return {
        afterConnect: connectMongoose(),
        getMongoStore(s: typeof session) {
            return createMongoStore(s, mongoUri);
        }
    };
}

// noinspection JSUnusedGlobalSymbols
export { setupMongoDb };