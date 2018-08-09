// setup.js
const fs = require('fs');

const MongodbMemoryServer = require('mongodb-memory-server');

const {globalConfigPath} = require("./utils/setupConstants");

const mongoServer = new MongodbMemoryServer.MongoMemoryServer();

module.exports = async function () {
    const mongoConfig = {
        mongoDBName: 'jest',
        mongoUri: await mongoServer.getConnectionString(),
    };

    // Write global config to disk because all tests run in different contexts.
    fs.writeFileSync(globalConfigPath, JSON.stringify(mongoConfig));

    // Set reference to mongod in order to close the server during teardown.
    global.__MONGOD__ = mongoServer;
};