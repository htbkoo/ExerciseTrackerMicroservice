import MongodbMemoryServer from "mongodb-memory-server";
import session from "express-session";
import mongoose from "mongoose";
import mongo from "connect-mongo"; // INFO: import of connect-mongo MUST go AFTER import of mongoose, or the import will hang forever

type MongoStoreCreator = (s: typeof session) => mongo.MongoStore;

const mongoServer = new MongodbMemoryServer();

function setMongoosePromise(promiseClass: any) {
    (<any>mongoose).Promise = promiseClass;
}

async function connectMongoose() {
    const mongoUri: string = await getMongoDbConnectionString();

    const mongooseOpts = { // options for mongoose 4.11.3 and above
        autoReconnect: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000,
        useMongoClient: true, // remove this line if you use mongoose 5 and above
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

function getMongoDbConnectionString() {
    return mongoServer.getConnectionString();
}

// Connect to MongoDB
function setupMongoDb(mongoUrl: string, promiseClass: any): { afterConnect: Promise<any>, getMongoStore: MongoStoreCreator } {
    setMongoosePromise(promiseClass);
    return {
        afterConnect: connectMongoose(),
        getMongoStore(s: typeof session) {
            return createMongoStore(s, "");
        }
    };
}

// you may stop mongod manually
// mongod.stop();
// or it will be stopped automatically when you exit from script

export { setupMongoDb };