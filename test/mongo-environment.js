// setup.js
const path = require('path');

const fs = require('fs');

const globalConfigPath = path.join(__dirname, '/__local__/globalConfig.json');


// mongo-environment.js
const NodeEnvironment = require('jest-environment-node');

async function setupDB() {
    const MongodbMemoryServer = require('mongodb-memory-server');

    const mongoServer = new MongodbMemoryServer.MongoMemoryServer();

    const mongoConfig = {
        mongoDBName: 'jest',
        mongoUri: await mongoServer.getConnectionString(),
    };

    // Write global config to disk because all tests run in different contexts.
    fs.writeFileSync(globalConfigPath, JSON.stringify(mongoConfig));

    // Set reference to mongod in order to close the server during teardown.
    global.__MONGOD__ = mongoServer;
}

module.exports = class MongoEnvironment extends NodeEnvironment {
    constructor(config) {
        super(config);
    }

    async setup() {
        console.log('Setup MongoDB Test Environment');

        if (!global.__MONGOD__) {
            await setupDB();
        }

        const globalConfig = JSON.parse(fs.readFileSync(globalConfigPath, 'utf-8'));

        this.global.__MONGO_URI__ = globalConfig.mongoUri;
        this.global.__MONGO_DB_NAME__ = globalConfig.mongoDBName;

        await super.setup();
    }

    async teardown() {
        console.log('Teardown MongoDB Test Environment');

        await super.teardown();
    }

    runScript(script) {
        return super.runScript(script);
    }
};